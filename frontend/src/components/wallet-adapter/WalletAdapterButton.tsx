'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Loader2, Wallet } from 'lucide-react';
import { type ReactNode, forwardRef } from 'react';

import { useIsMounted } from '@/lib/hooks/useIsMounted';

import { type ButtonProps, Button } from '@/components/ui/button';

export interface WalletAdapterButtonProps extends ButtonProps {
  icon?: ReactNode;
}

const WalletAdapterButton = forwardRef<
  HTMLButtonElement,
  WalletAdapterButtonProps
>(
  (
    { size = 'default', icon = <Wallet className='mr-2 h-4 w-4' />, ...props },
    ref,
  ) => {
    const isMounted = useIsMounted();
    const { isLoading } = useWallet();

    // Combined loading and mounted checks for efficiency
    const isButtonDisabled = !isMounted || isLoading;

    return (
      <Button
        size={size}
        disabled={isButtonDisabled}
        aria-busy={isButtonDisabled}
        ref={ref}
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
  },
);

export { WalletAdapterButton };
