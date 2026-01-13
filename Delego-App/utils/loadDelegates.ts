import { ethers } from "ethers";
import { SEPOLIA_RPC, WALLET_ABI } from "./constants";

const BLOCK_STEP = 5000; // safe for RPC

export async function loadDelegatedWallets(userAddress: string) {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const iface = new ethers.Interface(WALLET_ABI);

  const event = iface.getEvent("DelegateAdded");
  if (!event) throw new Error("DelegateAdded event not found");

  const topic = event.topicHash;
  const delegateTopic = ethers.zeroPadValue(userAddress, 32);

  const latest = await provider.getBlockNumber();
  const start = Math.max(latest - 50000, 0); // last 50k blocks

  const wallets = new Set<string>();

  for (let from = start; from <= latest; from += BLOCK_STEP) {
    const to = Math.min(from + BLOCK_STEP, latest);

    const logs = await provider.getLogs({
      fromBlock: from,
      toBlock: to,
      topics: [topic, null, delegateTopic],
    });

    for (const log of logs) {
      const parsed = iface.parseLog(log);
      if (!parsed) continue;

      wallets.add(parsed.args.wallet);
    }
  }

  return Array.from(wallets);
}
