'use client';

import { Network } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Info } from 'lucide-react';
import { FC, ReactElement, ReactNode } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { chainName, ENABLED_CHAINS, PREFERRED_CHAIN } from '@/config';

interface NetworksProps extends ButtonProps {
  chainIds?: Network[]; // Default to ENABLED_CHAINS if not provided
  chainId?: Network; // Default to PREFERRED_CHAIN if not provided
  hoverCardContent?: ReactNode;
}

const Networks: FC<NetworksProps> = ({
  chainIds = ENABLED_CHAINS,
  chainId = PREFERRED_CHAIN,
  size = 'xl',
  children,
  hoverCardContent,
  ...rest
}): ReactElement | null => {
  const { network, changeNetwork } = useWallet();

  // If no network is detected, return a default message
  if (!network?.name) {
    return (
      <Button size={size} {...rest}>
        Network not detected
      </Button>
    );
  }

  // Convert chainIds to a Set for efficient lookup
  const allowedChainIds = new Set(chainIds);

  const handleSwitchNetwork = () => {
    changeNetwork(chainId);
  };

  // If the current network is not allowed, display the switch button
  if (!allowedChainIds.has(network.name)) {
    return hoverCardContent ? (
      <HoverCard openDelay={0} closeDelay={0}>
        <Button
          size={size}
          onClick={handleSwitchNetwork}
          {...rest}
        >
          We do not support {chainName[network.name] ?? 'this network'}. Switch
          to {chainName[chainId]}{' '}
          <HoverCardTrigger>
            <Info className='ml-2 h-4 w-4' />
          </HoverCardTrigger>
        </Button>
        <HoverCardContent className='max-w-[360px]'>
          {hoverCardContent}
        </HoverCardContent>
      </HoverCard>
    ) : (
      <Button
        size={size}
        onClick={handleSwitchNetwork}
        {...rest}
      >
        We do not support {chainName[network.name] ?? 'this network'}. Switch to{' '}
        {chainName[chainId]}
      </Button>
    );
  }

  // Render children when the current network is supported
  return <>{children}</>;
};

export { type NetworksProps, Networks };
