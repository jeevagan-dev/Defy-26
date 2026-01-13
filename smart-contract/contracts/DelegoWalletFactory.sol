// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DelegoWallet.sol";

contract DelegoWalletFactory {
    mapping(address => address) private ownerToWallet;

    event WalletCreated(address indexed owner, address wallet);

    function createWallet() external returns (address wallet) {
        require(ownerToWallet[msg.sender] == address(0), "Already exists");

        DelegoWallet w = new DelegoWallet(msg.sender);
        wallet = address(w);

        ownerToWallet[msg.sender] = wallet;
        emit WalletCreated(msg.sender, wallet);
    }

    function getMyWallet() external view returns (address) {
        return ownerToWallet[msg.sender];
    }
}
