'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-green-600">Connected: {address}</p>
        <button
          className="rounded bg-slate-700 px-4 py-2 text-white hover:bg-slate-800"
          onClick={() => disconnect()}
          type="button"
        >
          Disconnect
        </button>
      </div>
    );
  }

  const connector = connectors[0];

  return (
    <div className="flex flex-col gap-3">
      <button
        className="w-fit rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        disabled={!connector || isPending}
        onClick={() => connector && connect({ connector })}
        type="button"
      >
        {isPending ? 'Connecting...' : `Connect ${connector?.name ?? 'Wallet'}`}
      </button>
      {error ? <p className="text-sm text-red-600">{error.message}</p> : null}
    </div>
  );
}
