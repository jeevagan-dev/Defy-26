const hre = require("hardhat");

async function main() {
  const Factory = await hre.ethers.getContractFactory("DelegoWalletFactory");

  const factory = await Factory.deploy();

  // ✅ ethers v6 compatible
  await factory.waitForDeployment();

  const address = await factory.getAddress();

  console.log("Factory deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
