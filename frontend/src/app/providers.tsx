'use client'

import React from 'react';
import { WalletProvider } from '@/providers/WalletProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  )
}