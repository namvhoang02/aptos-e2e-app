'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Loader2, Wallet } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { useIsMounted } from '@/lib/hooks/useIsMounted';

import { Button, ButtonProps } from '@/components/ui/button';

interface WalletAdapterButtonProps extends ButtonProps {
  icon?: ReactNode;
}

const WalletAdapterButton: FC<WalletAdapterButtonProps> = ({
  size = 'default',
  icon = <Wallet className='mr-2 h-4 w-4' />,
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
          {icon}
          <span className='hidden sm:inline'>Connect Wallet</span>
          <span className='inline sm:hidden'>Connect</span>
        </>
      )}
    </Button>
  );
};

export { WalletAdapterButton };
