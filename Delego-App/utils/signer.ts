import { ethers } from 'ethers';
import { provider } from './provider';

export function getSigner(privateKey: string): ethers.Wallet {
  return new ethers.Wallet(privateKey, provider);
}
