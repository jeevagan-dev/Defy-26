import { ethers } from 'ethers';
import { SEPOLIA_RPC } from '@/utils/constants';

export async function waitForTx(hash: string) {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  return await provider.waitForTransaction(hash);
}
