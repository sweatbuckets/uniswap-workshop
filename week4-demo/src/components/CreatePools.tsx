'use client';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import lpAbi from '../abi/LiquidityProvider.json';

const LP_CONTRACT = '0xd6e758bED11A61BcA082ACFd31764a1F4765DFd2'; // forge script으로 배포한 주소

export function CreatePool() {
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleCreatePool = () => {
    writeContract({
      address: LP_CONTRACT as `0x${string}`,
      abi: lpAbi,
      functionName: 'createPool',
      args: [tokenA as `0x${string}`, tokenB as `0x${string}`, 3000],
    });
  };

  return (
    <div>
      <h2>풀 생성</h2>
      <input placeholder="Token A 주소" value={tokenA} onChange={e => setTokenA(e.target.value)} />
      <input placeholder="Token B 주소" value={tokenB} onChange={e => setTokenB(e.target.value)} />
      <button onClick={handleCreatePool} disabled={isPending || isConfirming}>
        {isPending ? '서명 대기...' : isConfirming ? '생성 중...' : '풀 생성'}
      </button>
      {isSuccess && <p>풀 생성 완료! TX: {hash}</p>}
    </div>
  );
}