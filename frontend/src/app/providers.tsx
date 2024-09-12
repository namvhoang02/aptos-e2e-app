'use client';

import React from 'react';

import { AptosClientProvider } from '@/providers/ClientProvider';
import { WalletProvider } from '@/providers/WalletProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <AptosClientProvider>{children}</AptosClientProvider>
    </WalletProvider>
  );
}
