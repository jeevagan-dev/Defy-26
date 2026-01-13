import { Lightning } from "@inco/js/lite";
import { handleTypes } from "@inco/js";
import { ethers } from "ethers";
import { SEPOLIA_RPC } from "./constants";

let incoInstance: any = null;

export async function getInco() {
  if (incoInstance) return incoInstance;

  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const network = await provider.getNetwork();

  incoInstance = await Lightning.latest("testnet", 84532);
  return incoInstance;
}
