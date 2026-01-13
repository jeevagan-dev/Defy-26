import * as SecureStore from 'expo-secure-store';

const WALLET_KEY = 'wallet_data';
const SMART_WALLET_KEY = 'smart_wallet_address';

export interface WalletData {
  privateKey: string;
  mnemonic: string;
  address: string;
}

/* =========================
   OWNER EOA WALLET
   ========================= */

/* Save EOA wallet */
export async function saveWallet(data: WalletData): Promise<void> {
  await SecureStore.setItemAsync(WALLET_KEY, JSON.stringify(data));
}

/* Get full EOA wallet (internal use only) */
export async function getWallet(): Promise<WalletData | null> {
  const data = await SecureStore.getItemAsync(WALLET_KEY);
  return data ? JSON.parse(data) : null;
}

/* Export ONLY private key */
export async function exportPrivateKey(): Promise<string | null> {
  const wallet = await getWallet();
  return wallet ? wallet.privateKey : null;
}

/* Export ONLY mnemonic */
export async function exportMnemonic(): Promise<string | null> {
  const wallet = await getWallet();
  return wallet ? wallet.mnemonic : null;
}

/* =========================
   SMART WALLET (DELEGO)
   ========================= */

/* Save smart wallet address */
export async function saveSmartWallet(address: string): Promise<void> {
  await SecureStore.setItemAsync(SMART_WALLET_KEY, address);
}

/* Get smart wallet address */
export async function getSmartWallet(): Promise<string | null> {
  return await SecureStore.getItemAsync(SMART_WALLET_KEY);
}

/* =========================
   CLEANUP
   ========================= */

/* Delete everything (EOA + smart wallet) */
export async function deleteWallet(): Promise<void> {
  await SecureStore.deleteItemAsync(WALLET_KEY);
  await SecureStore.deleteItemAsync(SMART_WALLET_KEY);
}
