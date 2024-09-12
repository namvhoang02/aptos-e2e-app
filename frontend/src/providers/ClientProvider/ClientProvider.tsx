import { Aptos, AptosConfig } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { type FC, type ReactNode, useEffect, useState } from 'react';

import { AptosClientContext } from './useClient';

export interface AptosClientProviderProps {
  children: ReactNode;
}

export const AptosClientProvider: FC<AptosClientProviderProps> = ({
  children,
}: AptosClientProviderProps) => {
  const [client, setClient] = useState<Aptos | null>(null);
  const { network } = useWallet();

  useEffect(() => {
    if (network?.name) {
      const config = new AptosConfig({ network: network.name });
      setClient(new Aptos(config));
    }
  }, [network]);

  return (
    <AptosClientContext.Provider
      value={{
        client,
      }}
    >
      {children}
    </AptosClientContext.Provider>
  );
};
