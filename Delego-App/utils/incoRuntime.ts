import { getZap, getWalletClient } from "@inco/js";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(
    "https://base-sepolia.g.alchemy.com/v2/Your api key"
  )
});

export async function getIncoWalletClient(privateKey: string) {
  return await getWalletClient({
    privateKey,
    chain: baseSepolia,
    transport: http()
  });
}

export async function getIncoZap() {
  return await getZap({
    chain: baseSepolia,
    transport: http()
  });
}
