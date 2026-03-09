'use client';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { useState, useEffect } from 'react';
import lpAbi from '../abi/LiquidityProvider.json';

const LP_CONTRACT = '0xd6e758bED11A61BcA082ACFd31764a1F4765DFd2';

const erc20Abi = [{
  name: 'approve', type: 'function', stateMutability: 'nonpayable',
  inputs: [
    { name: 'spender', type: 'address' },
    { name: 'amount',  type: 'uint256' },
  ],
  outputs: [{ name: '', type: 'bool' }],
}] as const;

export function AddLiquidity() {
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [amount, setAmount] = useState('1000');
  const [step, setStep] = useState<'approve0' | 'approve1' | 'mint'>('approve0');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      if (step === 'approve0') setStep('approve1');
      else if (step === 'approve1') setStep('mint');
    }
  }, [isSuccess, step]);

  const handleApprove0 = () => writeContract({
    address: tokenA as `0x${string}`, abi: erc20Abi, functionName: 'approve',
    args: [LP_CONTRACT as `0x${string}`, parseEther(amount)],
  });

  const handleApprove1 = () => writeContract({
    address: tokenB as `0x${string}`, abi: erc20Abi, functionName: 'approve',
    args: [LP_CONTRACT as `0x${string}`, parseEther(amount)],
  });

  const handleMint = () => writeContract({
    address: LP_CONTRACT as `0x${string}`, abi: lpAbi, functionName: 'addLiquidity',
    args: [
      tokenA as `0x${string}`, tokenB as `0x${string}`,
      3000, parseEther(amount), parseEther(amount),
    ],
  });

  const inputClassName =
    'w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 placeholder:text-slate-400';

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-24px_rgba(16,24,40,0.28)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Liquidity</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">유동성 추가</h2>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Token A 주소</span>
          <input
            className={inputClassName}
            placeholder="0x..."
            value={tokenA}
            onChange={(e) => setTokenA(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Token B 주소</span>
          <input
            className={inputClassName}
            placeholder="0x..."
            value={tokenB}
            onChange={(e) => setTokenB(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">각 토큰 수량</span>
          <input
            className={inputClassName}
            placeholder="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {step === 'approve0'
            ? 'Token A 승인 단계'
            : step === 'approve1'
              ? 'Token B 승인 단계'
              : '유동성 추가 단계'}
        </span>

        {step === 'approve0' ? (
          <button
            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            onClick={handleApprove0}
            disabled={isPending}
          >
            {isPending ? '처리 중...' : '1/3: Token A Approve'}
          </button>
        ) : null}

        {step === 'approve1' ? (
          <button
            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            onClick={handleApprove1}
            disabled={isPending}
          >
            {isPending ? '처리 중...' : '2/3: Token B Approve'}
          </button>
        ) : null}

        {step === 'mint' ? (
          <button
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            onClick={handleMint}
            disabled={isPending}
          >
            {isPending ? '처리 중...' : '3/3: 유동성 추가'}
          </button>
        ) : null}
      </div>
    </div>
  );
}
