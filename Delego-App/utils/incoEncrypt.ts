import { getInco } from "./incoClient";
import { handleTypes } from "@inco/js";

export async function encryptValue(
  value: bigint,
  userAddress: string,
  contractAddress: string
): Promise<string> {
  const inco = await getInco();

  const encrypted = await inco.encrypt(value, {
    accountAddress: userAddress,
    dappAddress: contractAddress,
    handleType: handleTypes.euint256,
  });

  return encrypted;
}
