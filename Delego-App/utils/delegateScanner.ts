import { ethers } from "ethers";
import { WALLET_ABI, SEPOLIA_RPC } from "./constants";

export function listenForDelegates(
  userAddress: string,
  onWalletDetected: (wallet: string) => void
) {
  const wsRpc = SEPOLIA_RPC.replace("https", "wss");
  const provider = new ethers.WebSocketProvider(wsRpc);

  const iface = new ethers.Interface(WALLET_ABI);
  const event = iface.getEvent("DelegateAdded");
  if (!event) throw new Error("DelegateAdded event not found");

  const filter = {
    topics: [
      event.topicHash,
      null,
      ethers.zeroPadValue(userAddress, 32),
    ],
  };

  provider.on(filter, (log) => {
    const parsed = iface.parseLog(log);
    if (!parsed) return;

    const wallet = parsed.args.wallet;
    onWalletDetected(wallet);
  });

  return () => {
    provider.removeAllListeners();
    provider.destroy();
  };
}
