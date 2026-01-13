// import { Wallet, Mnemonic } from 'ethers';
// import 'react-native-url-polyfill/auto';
// import * as Crypto from 'expo-crypto';

// export interface WalletInfo {
//   address: string;
//   privateKey: string;
//   mnemonic: string;
// }


// // ✅ Generate wallet safely in Expo
// export async function createWallet(): Promise<WalletInfo> {
//   // 16 bytes = 128 bits entropy (standard)
//   const entropy = Crypto.getRandomBytes(16);

//   const entropyHex = Array.from(entropy)
//   .map(b => b.toString(16).padStart(2, '0'))
//   .join('');

//   const mnemonic = Mnemonic.fromEntropy(entropyHex);
//   const wallet = Wallet.fromPhrase(mnemonic.phrase);

//   return {
//     address: wallet.address,
//     privateKey: wallet.privateKey,
//     mnemonic: mnemonic.phrase,
//   };
// }

// export function importWalletFromMnemonic(mnemonic: string): WalletInfo {
//   const wallet = Wallet.fromPhrase(mnemonic);
//   return {
//     address: wallet.address,
//     privateKey: wallet.privateKey,
//     mnemonic: mnemonic,
//   };
// }

// export function validateMnemonic(mnemonic: string): boolean {
//   try {
//     Mnemonic.fromPhrase(mnemonic);
//     return true;
//   } catch {
//     return false;
//   }
// }

import 'react-native-url-polyfill/auto';
import * as Crypto from 'expo-crypto';
import { Wallet, Mnemonic } from 'ethers';

export interface WalletInfo {
  address: string;
  privateKey: string;
  mnemonic: string;
}

export async function createWallet(): Promise<WalletInfo> {
  // 128-bit secure entropy
  const entropy = Crypto.getRandomBytes(16); // Uint8Array ✅

  // ✅ PASS ENTROPY DIRECTLY (no hex conversion)
  const mnemonic = Mnemonic.fromEntropy(entropy);

  const wallet = Wallet.fromPhrase(mnemonic.phrase);

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: mnemonic.phrase,
  };
}

export function importWalletFromMnemonic(mnemonic: string): WalletInfo {
  const wallet = Wallet.fromPhrase(mnemonic.trim());
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic,
  };
}

export function validateMnemonic(mnemonic: string): boolean {
  try {
    Mnemonic.fromPhrase(mnemonic.trim());
    return true;
  } catch {
    return false;
  }
}
