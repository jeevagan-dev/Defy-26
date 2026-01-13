
import { encryptValue } from "./incoEncrypt";
import { getIncoFee } from "./incoFee";
import { ethers } from "ethers";
import { WALLET_ABI } from "./constants";
import { SEPOLIA_RPC } from "./constants";

export async function addDelegate(
  walletAddress: string,
  privateKey: string,
  delegate: string,
  dailyLimitEth: string,
  expiryTimestamp: number
) {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const signer = new ethers.Wallet(privateKey, provider);

  const wallet = new ethers.Contract(walletAddress, WALLET_ABI, signer);

  const dailyLimit = ethers.parseEther(dailyLimitEth);

  // 🔐 Encrypt using Inco
  const encryptedLimit = await encryptValue(
    dailyLimit,
    signer.address,
    walletAddress
  );

  const encryptedExpiry = await encryptValue(
    BigInt(expiryTimestamp),
    signer.address,
    walletAddress
  );

  const fee = await getIncoFee();

  const tx = await wallet.addDelegate(
    delegate,
    encryptedLimit,
    encryptedExpiry,
    { value: fee * 2n }
  );

  await tx.wait();
}


export function getWalletContract(walletAddress: string, privateKey: string) {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const signer = new ethers.Wallet(privateKey, provider);

  return new ethers.Contract(walletAddress, WALLET_ABI, signer);
}

// export async function addDelegate(
//   walletAddress: string,
//   privateKey: string,
//   delegate: string,
//   dailyLimit: string,
//   expiry: number
// ) {
//   const contract = getWalletContract(walletAddress, privateKey);

//   const tx = await contract.addDelegate(
//     delegate,
//     ethers.parseEther(dailyLimit),
//     expiry
//   );

//   await tx.wait();
// }

export async function revokeDelegate(
  walletAddress: string,
  privateKey: string,
  delegate: string
) {
  const contract = getWalletContract(walletAddress, privateKey);

  const tx = await contract.revokeDelegate(delegate);
  await tx.wait();
}

export async function getDelegateInfo(walletAddress: string, delegate: string) {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const contract = new ethers.Contract(walletAddress, WALLET_ABI, provider);

  return await contract.delegates(delegate);
}
