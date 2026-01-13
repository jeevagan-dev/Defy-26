import { ethers } from 'ethers';
import { SEPOLIA_RPC } from '@/utils/constants';

export async function estimateEthTransferGas(
  from: string,
  to: string,
  amountEth: string
) {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);

  const value = ethers.parseEther(amountEth);

  const gasLimit = await provider.estimateGas({
    from,
    to,
    value,
  });

  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice || 0n;

  const fee = gasLimit * gasPrice;

  return {
    gasLimit: gasLimit.toString(),
    gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
    feeEth: ethers.formatEther(fee),
  };
}
