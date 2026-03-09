'use client';

import { Swap } from '../components/Swap';
import { AddLiquidity } from '../components/AddLiquidity';
import { ConnectWallet } from '../components/ConnectWallet';

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-[32px] border border-slate-200/80 bg-white/80 p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Uniswap Workshop</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Wallet, Swap, Liquidity</h1>
          <div className="mt-6">
            <ConnectWallet />
          </div>
        </div>

        <section className="mb-8">
          <Swap />
        </section>

        <section>
          <AddLiquidity />
        </section>
      </div>
    </main>
  );
}
