import { ethers } from 'ethers';
import { SEPOLIA_RPC } from './constants';

export const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
