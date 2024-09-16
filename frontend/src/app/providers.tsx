'use client';

import React from 'react';

import { AptosClientProvider } from '@/providers/ClientProvider';
import { QueryClientProvider } from '@/providers/query-client-provider';
import { WalletProvider } from '@/providers/WalletProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <WalletProvider>
        <AptosClientProvider>{children}</AptosClientProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}
