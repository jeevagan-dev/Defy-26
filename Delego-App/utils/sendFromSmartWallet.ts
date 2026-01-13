import { ethers } from "ethers";
import { SEPOLIA_RPC, WALLET_ABI } from "./constants";

export async function sendFromSmartWallet(
  smartWallet: string,
  privateKey: string,
  to: string,
  amountEth: string
) {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const signer = new ethers.Wallet(privateKey, provider);

  const walletContract = new ethers.Contract(
    smartWallet,
    WALLET_ABI,
    signer
  );

  const tx = await walletContract.execute(
    to,
    ethers.parseEther(amountEth)
  );

  await tx.wait();
  return tx.hash;
}
