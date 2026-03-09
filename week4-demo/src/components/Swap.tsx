'use client';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { useState, useEffect } from 'react';

const SWAP_ROUTER = '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E';

const swapRouterAbi = [{
  name: 'exactInputSingle', type: 'function', stateMutability: 'payable',
  inputs: [{
    name: 'params', type: 'tuple',
    components: [
      { name: 'tokenIn',           type: 'address' },
      { name: 'tokenOut',          type: 'address' },
      { name: 'fee',               type: 'uint24'  },
      { name: 'recipient',         type: 'address' },
      { name: 'deadline',          type: 'uint256' },
      { name: 'amountIn',          type: 'uint256' },
      { name: 'amountOutMinimum',  type: 'uint256' },
      { name: 'sqrtPriceLimitX96', type: 'uint160' },
    ],
  }],
  outputs: [{ name: 'amountOut', type: 'uint256' }],
}] as const;

const erc20Abi = [{
  name: 'approve', type: 'function', stateMutability: 'nonpayable',
  inputs: [
    { name: 'spender', type: 'address' },
    { name: 'amount',  type: 'uint256' },
  ],
  outputs: [{ name: '', type: 'bool' }],
}] as const;

export function Swap() {
  const { address } = useAccount();
  const [tokenIn,  setTokenIn]  = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [amountIn, setAmountIn] = useState('100');
  const [step, setStep] = useState<'approve' | 'swap'>('approve');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess && step === 'approve') setStep('swap');
  }, [isSuccess, step]);

  const handleApprove = () => writeContract({
    address: tokenIn as `0x${string}`, abi: erc20Abi, functionName: 'approve',
    args: [SWAP_ROUTER as `0x${string}`, parseEther(amountIn)],
  });

  const handleSwap = () => {
    if (!address) return;
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200);
    writeContract({
      address: SWAP_ROUTER as `0x${string}`,
      abi: swapRouterAbi,
      functionName: 'exactInputSingle',
      args: [{
        tokenIn:  tokenIn  as `0x${string}`,
        tokenOut: tokenOut as `0x${string}`,
        fee: 3000, recipient: address, deadline,
        amountIn: parseEther(amountIn),
        amountOutMinimum: 0n, sqrtPriceLimitX96: 0n,
      }],
    });
  };

  const inputClassName =
    'w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400';

  const actionLabel = step === 'approve' ? '1/2: Approve' : '2/2: Swap 실행';

  return (
    <div className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Swap</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">토큰 스왑</h2>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Token In 주소</span>
          <input
            className={inputClassName}
            placeholder="0x..."
            value={tokenIn}
            onChange={(e) => setTokenIn(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Token Out 주소</span>
          <input
            className={inputClassName}
            placeholder="0x..."
            value={tokenOut}
            onChange={(e) => setTokenOut(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">수량</span>
          <input
            className={inputClassName}
            placeholder="100"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {step === 'approve' ? '승인 단계' : '스왑 단계'}
        </span>
        {step === 'approve' ? (
          <button
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            onClick={handleApprove}
            disabled={isPending}
          >
            {isPending ? '처리 중...' : actionLabel}
          </button>
        ) : (
          <button
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            onClick={handleSwap}
            disabled={isPending}
          >
            {isPending ? '처리 중...' : actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
