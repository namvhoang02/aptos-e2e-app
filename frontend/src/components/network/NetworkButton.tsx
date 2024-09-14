'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { type ReactNode, forwardRef } from 'react';

import { AptosCircle } from '@/components/icons/network/circle/AptosCircle';
import { Button, ButtonProps } from '@/components/ui/button';

import { chainName } from '@/config';

interface NetworkButtonProps extends ButtonProps {
  icon?: ReactNode;
}

const NetworkButton = forwardRef<HTMLButtonElement, NetworkButtonProps>(
  (
    {
      size = 'default',
      icon = <AptosCircle className='mr-2 h-4 w-4' />,
      ...props
    },
    ref,
  ) => {
    const { connected, network } = useWallet();

    // network is only available when the user connects to a wallet
    if (!connected) {
      return null;
    }

    return (
      <Button variant='secondary' size={size} ref={ref} {...props}>
        {icon}
        {network?.name && chainName[network.name]}
      </Button>
    );
  },
);

export { NetworkButton };
