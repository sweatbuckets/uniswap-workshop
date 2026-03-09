import './globals.css';

import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { Providers } from '../components/Providers';

export const metadata: Metadata = {
  title: 'Uniswap Workshop Demo',
  description: 'Wagmi v3.5 setup for wallet connection and swap demos.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
