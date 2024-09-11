// https://github.com/sushiswap/sushiswap/blob/master/apps/web/src/config.ts
// https://github.com/aptos-labs/aptos-ts-sdk/blob/main/src/utils/apiEndpoints.ts
// https://github.com/aptos-labs/aptos-wallet-adapter/blob/main/packages/wallet-adapter-core/src/constants.ts
import { Network } from '@aptos-labs/ts-sdk';

// export const APTOS_COIN_ID = 637;
export const CHAINS = [
  Network.MAINNET,
  Network.DEVNET,
  Network.TESTNET,
  Network.LOCAL,
  Network.CUSTOM,
] as const;

export const ENABLED_CHAINS = [
  Network.DEVNET,
  Network.TESTNET,
  Network.LOCAL,
  Network.CUSTOM,
] as const;

export const PREFERRED_CHAIN = Network.DEVNET;

export const chainName = {
  [Network.DEVNET]: 'Aptos - Devnet',
  [Network.TESTNET]: 'Aptos - Testnet',
  [Network.MAINNET]: 'Aptos - Mainnet',
  [Network.LOCAL]: 'Aptos - Local',
  [Network.CUSTOM]: 'Aptos - Custom',
};
