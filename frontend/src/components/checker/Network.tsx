// https://github.com/sushiswap/sushiswap/blob/master/apps/web/src/lib/wagmi/systems/Checker/Network.tsx
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

import { chainName } from '@/config';

interface NetworkCheckerProps extends ButtonProps {
  chainId?: Network; // Made optional since undefined is acceptable
  hoverCardContent?: ReactNode;
}

const NetworkChecker: FC<NetworkCheckerProps> = ({
  chainId,
  size = 'xl',
  children,
  hoverCardContent,
  ...rest
}): ReactElement | null => {
  const { network, changeNetwork } = useWallet();

  // Early return if chainId is not provided
  if (!chainId) return null;

  const handleNetworkSwitch = () => {
    changeNetwork(chainId);
  };

  // Check if the current network matches the desired chain
  if (network?.name !== chainId) {
    return hoverCardContent ? (
      <HoverCard openDelay={0} closeDelay={0}>
        <Button size={size} onClick={handleNetworkSwitch} {...rest}>
          Switch to {chainName[chainId] ?? 'this network'}
          <HoverCardTrigger>
            <Info className='ml-2 h-4 w-4' />
          </HoverCardTrigger>
        </Button>
        <HoverCardContent className='max-w-[360px]'>
          {hoverCardContent}
        </HoverCardContent>
      </HoverCard>
    ) : (
      <Button size={size} onClick={handleNetworkSwitch} {...rest}>
        Switch to {chainName[chainId] ?? 'this network'}
      </Button>
    );
  }

  return <>{children}</>;
};

export { type NetworkCheckerProps, NetworkChecker };
