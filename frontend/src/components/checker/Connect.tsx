// https://raw.githubusercontent.com/sushiswap/sushiswap/7b80a1ad19c129eb964b9e699c025f0f61eb8b2d/apps/web/src/lib/wagmi/systems/Checker/Connect.tsx
'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React, { type FC } from 'react';

import { type ButtonProps } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';

import { WalletAdapterButton } from '../wallet-adapter/WalletAdapterButton';
import { WalletAdapterModelDialog } from '../wallet-adapter/WalletAdapterModelDialog';

// Define the props to ensure children and fallback are properly typed
interface ConnectProps extends ButtonProps {
  fallback?: React.ReactNode;
}

// Define default props outside the function for better clarity
const defaultProps: Partial<ConnectProps> = {
  size: 'default',
};

const Connect: FC<ConnectProps> = ({ children, fallback, size, ...props }) => {
  const { connected } = useWallet();

  // Render fallback immediately if provided and wallet is not connected
  if (!connected) {
    return (
      <WalletAdapterModelDialog>
        {fallback ? (
          <>{fallback}</>
        ) : (
          <DialogTrigger asChild>
            <WalletAdapterButton size={size} {...props} />
          </DialogTrigger>
        )}
      </WalletAdapterModelDialog>
    );
  }

  // Once the wallet is connected, render the children
  return <>{children}</>;
};

// Apply default props to ensure defaults are respected
Connect.defaultProps = defaultProps;

export { Connect };
