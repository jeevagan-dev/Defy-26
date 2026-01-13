import { encryptValue } from "./incoEncrypt";
import { attestedDecrypt } from "./incoDecrypt";
import { getIncoFee } from "./incoFee";
import { ethers } from "ethers";
import { SEPOLIA_RPC } from "./constants";
import { WALLET_ABI } from "./constants";

export async function confidentialSend(
  walletAddress: string,
  privateKey: string,
  to: string,
  amountEth: string
) {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const signer = new ethers.Wallet(privateKey, provider);
  const wallet = new ethers.Contract(walletAddress, WALLET_ABI, signer);

  // encrypt amount
  const encrypted = await encryptValue(
    ethers.parseEther(amountEth),
    signer.address,
    walletAddress
  );

  // prepare execution
  const fee = await getIncoFee();

  const tx = await wallet.prepareExecution(encrypted, {
    value: fee
  });

  const receipt = await tx.wait();
  const handle = receipt.logs[0].args.handle;

  // decrypt with TEE
  const decrypted = await attestedDecrypt(privateKey, handle);

  // execute
  const execTx = await wallet.executeWithAttestation(
    decrypted.attestation,
    decrypted.signature,
    to
  );

  await execTx.wait();
}
