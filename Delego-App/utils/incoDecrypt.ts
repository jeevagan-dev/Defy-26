import { getInco } from "./incoClient";
import { ethers } from "ethers";
import { SEPOLIA_RPC } from "./constants";

export async function attestedDecrypt(
  privateKey: string,
  handle: string
): Promise<{
  plaintext: bigint;
  attestation: any;
  signature: string[];
}> {
  const inco = await getInco();

  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const wallet = new ethers.Wallet(privateKey, provider);

  const result = await inco.attestedDecrypt(wallet, [handle]);

  const item = result[0];

  return {
    plaintext: item.plaintext.value,
    attestation: {
      handle: item.handle,
      value: item.plaintext.value
    },
    signature: item.covalidatorSignatures.map((s: Uint8Array) =>
      ethers.hexlify(s)
    )
  };
}
