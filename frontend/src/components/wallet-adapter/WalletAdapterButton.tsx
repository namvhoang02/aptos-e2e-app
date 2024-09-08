// https://raw.githubusercontent.com/sushiswap/sushiswap/7b80a1ad19c129eb964b9e699c025f0f61eb8b2d/apps/web/src/lib/wagmi/systems/Checker/Connect.tsx
'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Loader2, Wallet } from 'lucide-react';
import { FC } from 'react';

import { useIsMounted } from '@/lib/hooks/useIsMounted';

import { Button, ButtonProps } from '@/components/ui/button';

const WalletAdapterButton: FC<ButtonProps> = ({
  children,
  size = 'default',
  ...props
}) => {
  const isMounted = useIsMounted();
  const { isLoading } = useWallet();

  // Combined loading and mounted checks for efficiency
  const isButtonDisabled = !isMounted || isLoading;

  return (
    <Button
      size={size}
      disabled={isButtonDisabled}
      aria-busy={isButtonDisabled}
      {...props}
    >
      {isButtonDisabled ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Loading...
        </>
      ) : (
        <>
          <Wallet className='mr-2 h-4 w-4' />
          <span className='hidden sm:inline'>Connect Wallet</span>
          <span className='inline sm:hidden'>Connect</span>
        </>
      )}
    </Button>
  );
};

export { WalletAdapterButton };
