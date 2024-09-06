// https://raw.githubusercontent.com/sushiswap/sushiswap/7b80a1ad19c129eb964b9e699c025f0f61eb8b2d/apps/web/src/lib/wagmi/systems/Checker/Connect.tsx
'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { FC } from 'react';

import { useIsMounted } from '@/lib/hooks/useIsMounted';

import { Button, ButtonProps } from '@/components/ui/button';
import { Dots } from '@/components/ui/dots';
// import { ConnectButton } from '../../components/connect-button'

const Connect: FC<ButtonProps> = ({ children, size = 'lg', ...props }) => {
  const isMounted = useIsMounted();

  // const { isDisconnected, isConnecting, isReconnecting } = useAccount()
  const { connected, isLoading } = useWallet();

  if (!isMounted)
    return (
      <Button size={size} {...props}>
        <div className='h-[1ch]' />
      </Button>
    );

  if (isLoading) {
    return (
      <Button size={size} disabled {...props}>
        <Dots>Checking Wallet</Dots>
      </Button>
    );
  }

  if (!connected)
    return (
      <Button size={size} {...props}>
        Connect Wallet
      </Button>
    );

  return <>{children}</>;
};

export { Connect };
