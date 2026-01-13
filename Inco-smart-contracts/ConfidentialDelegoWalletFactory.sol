// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./ConfidentialDelegoWallet.sol";

contract ConfidentialDelegoWalletFactory {
    mapping(address => address) public ownerToWallet;

    event WalletCreated(address indexed owner, address wallet);

    function createWallet() external returns (address wallet) {
        require(ownerToWallet[msg.sender] == address(0), "Already exists");

        ConfidentialDelegoWallet w = new ConfidentialDelegoWallet(msg.sender);
        wallet = address(w);

        ownerToWallet[msg.sender] = wallet;
        emit WalletCreated(msg.sender, wallet);
    }
}
