'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { type FC, type ReactNode } from 'react';

import { AptosCircle } from '@/components/icons/network/circle/AptosCircle';
import { Button, ButtonProps } from '@/components/ui/button';

import { chainName } from '@/config';

interface NetworkButtonProps extends ButtonProps {
  icon?: ReactNode;
}

const NetworkButton: FC<NetworkButtonProps> = ({
  size = 'default',
  icon = <AptosCircle className='mr-2 h-4 w-4' />,
  ...props
}) => {
  const { connected, network } = useWallet();

  // network is only available when the user connects to a wallet
  if (!connected) {
    return null;
  }

  return (
    <Button size={size} variant='secondary' {...props}>
      {icon}
      {network?.name && chainName[network.name]}
    </Button>
  );
};

export { NetworkButton };
