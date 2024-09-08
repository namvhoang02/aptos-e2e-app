'use client';

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { PropsWithChildren } from 'react';

const wallets = [
  new PetraWallet(),
  // new PontemWallet(),
  // new FewchaWallet(),
  // new MartianWallet(),
  // new RiseWallet(),
  // new MSafeWalletAdapter(),
];

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  );
}
