// https://raw.githubusercontent.com/sushiswap/sushiswap/7b80a1ad19c129eb964b9e699c025f0f61eb8b2d/apps/web/src/lib/wagmi/systems/Checker/Connect.tsx
'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { FC } from 'react';

import { type ButtonProps } from '@/components/ui/button';

import { WalletAdapterButton } from '../wallet-adapter/WalletAdapterButton';
import { WalletAdapterModelDialog } from '../wallet-adapter/WalletAdapterModelDialog';

const Connect: FC<ButtonProps> = ({ children, size = 'default', ...props }) => {
  const { connected } = useWallet();

  // If the component is not mounted, wallet is loading, or not connected,
  // show the WalletAdapterModelDialog with the WalletAdapterButton
  if (!connected) {
    return (
      <WalletAdapterModelDialog>
        <WalletAdapterButton size={size} {...props} />
      </WalletAdapterModelDialog>
    );
  }

  // Once the wallet is connected, render the children
  return <>{children}</>;
};

export { Connect };
