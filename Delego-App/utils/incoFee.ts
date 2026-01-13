import { getInco } from "./incoClient";
import { ethers } from "ethers";
import { SEPOLIA_RPC } from "./constants";

export async function getIncoFee(): Promise<bigint> {
  const inco = await getInco();
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);

  const fee = await provider.call({
    to: inco.executorAddress,
    data: "0x3f5b7b0a" // getFee()
  });

  return BigInt(fee);
}
