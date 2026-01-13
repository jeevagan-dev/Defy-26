import { ethers } from 'ethers';
import { getWallet } from './secureStore';
import { SEPOLIA_RPC } from './constants';

export async function sendEthToSmartWallet(
  smartWallet: string,
  amountEth: string
) {
  const wallet = await getWallet();
  if (!wallet) throw new Error('Wallet not found');

  const provider = new ethers.JsonRpcProvider(
    SEPOLIA_RPC
  );

  const signer = new ethers.Wallet(wallet.privateKey, provider);

  const tx = await signer.sendTransaction({
    to: smartWallet,
    value: ethers.parseEther(amountEth),
  });

  await tx.wait();
  return tx.hash;
}
