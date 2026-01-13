// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@inco/lightning/src/IncoLightning.sol";

contract DelegoWallet is IncoLightning {
    address public owner;

    struct Delegate {
        bool active;
        euint256 dailyLimit;
        euint256 spentToday;
        uint256 lastReset;
        euint256 expiry;
    }

    mapping(address => Delegate) private delegates;

    event DelegateAdded(address indexed wallet, address indexed delegate);
    event DelegateRevoked(address indexed wallet, address indexed delegate);
    event Executed(address indexed wallet, address indexed by, address to);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAllowed() {
        require(msg.sender == owner || delegates[msg.sender].active, "Not allowed");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    receive() external payable {}

    function addDelegateEncrypted(
        address delegate,
        euint256 encDailyLimit,
        euint256 encExpiry
    ) external onlyOwner {
        delegates[delegate] = Delegate(
            true,
            encDailyLimit,
            FHE.asEuint256(0),
            block.timestamp,
            encExpiry
        );

        emit DelegateAdded(address(this), delegate);
    }

    function revokeDelegate(address delegate) external onlyOwner {
        delete delegates[delegate];
        emit DelegateRevoked(address(this), delegate);
    }

    function execute(address payable to, euint256 encValue) external onlyAllowed {
        if (msg.sender != owner) {
            Delegate storage d = delegates[msg.sender];

            require(FHE.decrypt(d.expiry) > block.timestamp, "Expired");

            if (block.timestamp > d.lastReset + 1 days) {
                d.spentToday = FHE.asEuint256(0);
                d.lastReset = block.timestamp;
            }

            euint256 newSpent = FHE.add(d.spentToday, encValue);
            require(FHE.lte(newSpent, d.dailyLimit), "Daily limit exceeded");

            d.spentToday = newSpent;
        }

        uint256 value = FHE.decrypt(encValue);
        (bool ok, ) = to.call{value: value}("");
        require(ok, "Transfer failed");

        emit Executed(address(this), msg.sender, to);
    }
}
