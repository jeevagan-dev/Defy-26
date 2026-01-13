// utils/history.ts

const ETHERSCAN_API_KEY = 'MGV2QSF3VU6P6479RNM1ZS8UKZU4ZFJ2B9';
const ETHERSCAN_V2_BASE = 'https://api.etherscan.io/v2/api';
const SEPOLIA_CHAIN_ID = 11155111;

export type TxItem = {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
};

export async function getTxHistory(address: string): Promise<TxItem[]> {
  try {
    const url =
      `${ETHERSCAN_V2_BASE}` +
      `?chainid=${SEPOLIA_CHAIN_ID}` +
      `&module=account` +
      `&action=txlist` +
      `&address=${address}` +
      `&startblock=0` +
      `&endblock=99999999` +
      `&page=1` +
      `&offset=10` +
      `&sort=desc` +
      `&apikey=${ETHERSCAN_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== '1') {
      return [];
    }

    return data.result as TxItem[];
  } catch (err) {
    console.error('Etherscan V2 history error:', err);
    return [];
  }
}