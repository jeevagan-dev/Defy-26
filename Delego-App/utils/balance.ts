import { ethers } from 'ethers';
import { SEPOLIA_RPC } from './constants';

const RPC_URL = SEPOLIA_RPC;

const provider = new ethers.JsonRpcProvider(RPC_URL);

export async function getBalance(address: string): Promise<string> {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance); 
}
