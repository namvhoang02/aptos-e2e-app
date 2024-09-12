import { Aptos } from '@aptos-labs/ts-sdk';
import { createContext, useContext } from 'react';

export interface AptosClientContextState {
  client: Aptos | null;
}

const DEFAULT_CONTEXT = {
  client: null,
};

export const AptosClientContext = createContext<AptosClientContextState>(
  DEFAULT_CONTEXT as AptosClientContextState,
);

export function useClient(): AptosClientContextState {
  const context = useContext(AptosClientContext);
  if (!context) {
    throw new Error('useClient must be used within a AptosClientContextState');
  }
  return context;
}
