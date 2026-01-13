// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { e, ebool, euint256, inco } from "@inco/lightning/src/Lib.sol";
import { DecryptionAttestation } from "@inco/lightning/src/lightning-parts/DecryptionAttester.types.sol";

contract ConfidentialDelegoWallet {
    address public owner;

    error InsufficientFees();
    error NotOwner();
    error NotAllowed();
    error TransferFailed();
    error InvalidAttestation();
    error HandleMismatch();

    struct Delegate {
        bool active;
        euint256 dailyLimit;
        euint256 spentToday;
        euint256 lastReset;
        euint256 expiry;
    }

    mapping(address => Delegate) public delegates;

    /// pending encrypted execution per caller (replay protection)
    mapping(address => euint256) public pendingExecution;

    event DelegateAdded(address indexed delegate);
    event DelegateRevoked(address indexed delegate);
    event ExecutionPrepared(address indexed by, euint256 handle);
    event Executed(address indexed by, address to, uint256 value);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyAllowed() {
        if (msg.sender != owner && !delegates[msg.sender].active) {
            revert NotAllowed();
        }
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    receive() external payable {}

    /* -------------------------------------------------------------------------- */
    /*                             DELEGATE MANAGEMENT                             */
    /* -------------------------------------------------------------------------- */

    function addDelegate(
        address delegate,
        bytes calldata encryptedDailyLimit,
        bytes calldata encryptedExpiry
    ) external payable onlyOwner {
        _requireFee(2);

        euint256 dailyLimit = e.newEuint256(encryptedDailyLimit, msg.sender);
        euint256 expiry = e.newEuint256(encryptedExpiry, msg.sender);

        e.allow(dailyLimit, address(this));
        e.allow(expiry, address(this));

        delegates[delegate] = Delegate(
            true,
            dailyLimit,
            e.asEuint256(0),
            e.asEuint256(block.timestamp),
            expiry
        );

        e.allow(delegates[delegate].spentToday, address(this));
        e.allow(delegates[delegate].lastReset, address(this));

        emit DelegateAdded(delegate);
    }

    function revokeDelegate(address delegate) external onlyOwner {
        delete delegates[delegate];
        emit DelegateRevoked(delegate);
    }

    /* -------------------------------------------------------------------------- */
    /*                  CONFIDENTIAL CONTROL FLOW (NO DECRYPTION)                 */
    /* -------------------------------------------------------------------------- */

    function prepareExecution(
        bytes calldata encryptedValue
    ) external payable onlyAllowed returns (euint256 handle) {
        _requireFee(1);

        euint256 value = e.newEuint256(encryptedValue, msg.sender);
        e.allow(value, address(this));

        if (msg.sender != owner) {
            Delegate storage d = delegates[msg.sender];

            euint256 nowTime = e.asEuint256(block.timestamp);

            // expiry check
            ebool notExpired = e.lt(nowTime, d.expiry);

            // daily reset logic
            euint256 resetTime = e.add(d.lastReset, e.asEuint256(1 days));
            ebool shouldReset = e.gt(nowTime, resetTime);

            d.spentToday = e.select(shouldReset, e.asEuint256(0), d.spentToday);
            d.lastReset = e.select(shouldReset, nowTime, d.lastReset);

            // spending limit
            euint256 newSpent = e.add(d.spentToday, value);
            ebool withinLimit = e.le(newSpent, d.dailyLimit);

            // combine conditions
            ebool allowed = e.and(notExpired, withinLimit);

            // multiplexer pattern (docs)
            value = e.select(allowed, value, e.asEuint256(0));
            d.spentToday = e.select(allowed, newSpent, d.spentToday);
        }

        // store expected handle for later attested decrypt
        pendingExecution[msg.sender] = value;

        emit ExecutionPrepared(msg.sender, value);

        return value; // encrypted handle for off-chain attested decrypt
    }

    /* -------------------------------------------------------------------------- */
    /*                    EXECUTION WITH ATTESTED DECRYPT RESULT                  */
    /* -------------------------------------------------------------------------- */

   function executeWithAttestation(
    DecryptionAttestation calldata attestation,
    bytes[] calldata signatures,
    address payable to
) external onlyAllowed {
    // 1) verify TEE signatures
    bool valid = inco.incoVerifier().isValidDecryptionAttestation(
        attestation,
        signatures
    );
    if (!valid) revert InvalidAttestation();

    // 2) verify handle matches expected encrypted policy result
    if (euint256.unwrap(pendingExecution[msg.sender]) != attestation.handle) {
        revert HandleMismatch();
    }

    // 3) clear pending execution (replay protection)
    pendingExecution[msg.sender] = e.asEuint256(0);

    // 4) execute transfer
    uint256 amount = uint256(attestation.value);

    (bool ok, ) = to.call{ value: amount }("");
    if (!ok) revert TransferFailed();

    emit Executed(msg.sender, to, amount);
}


    /* -------------------------------------------------------------------------- */
    /*                                   HELPERS                                  */
    /* -------------------------------------------------------------------------- */

    function _requireFee(uint256 cipherTextCount) internal view {
        if (msg.value < inco.getFee() * cipherTextCount) revert InsufficientFees();
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
