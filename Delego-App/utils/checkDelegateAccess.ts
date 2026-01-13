import { ethers } from "ethers";
import { SEPOLIA_RPC, WALLET_ABI } from "./constants";

export async function checkDelegateAccess(
  walletAddress: string,
  userAddress: string
) {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const wallet = new ethers.Contract(walletAddress, WALLET_ABI, provider);

  const info = await wallet.delegates(userAddress);

  return {
    active: info.active,
    dailyLimit: info.dailyLimit,
    spentToday: info.spentToday,
    expiry: info.expiry
  };
}
