import { ethers } from "ethers";
import factoryABI from "../app/abi/DelegoWalletFactory.json";
import { FACTORY_ADDRESS, SEPOLIA_RPC } from "./constants";

export async function getOrCreateSmartWallet(
  privateKey: string
): Promise<string> {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const signer = new ethers.Wallet(privateKey, provider);

  const factory = new ethers.Contract(
    FACTORY_ADDRESS,
    factoryABI,
    signer
  );

  let wallet = await factory.ownerToWallet(signer.address);

  if (wallet === ethers.ZeroAddress) {
    const tx = await factory.createWallet();
    await tx.wait();

    wallet = await factory.ownerToWallet(signer.address);
  }

  return wallet;
}
