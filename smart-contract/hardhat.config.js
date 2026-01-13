require("@nomicfoundation/hardhat-toolbox");
require("@inco/lightning/dist/hardhat");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.20" },
      { version: "0.8.21" },
      { version: "0.8.22" }
    ]
  },
  networks: {
    baseSepolia: {
      url: process.env.BASE_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
