// https://github.com/sushiswap/sushiswap/blob/master/apps/web/src/config.ts
// https://github.com/aptos-labs/aptos-ts-sdk/blob/main/src/utils/apiEndpoints.ts
// https://github.com/aptos-labs/aptos-wallet-adapter/blob/main/packages/wallet-adapter-core/src/constants.ts
import { Network } from '@aptos-labs/ts-sdk';

// export const APTOS_COIN_ID = 637;
export const CHAINS = [
  Network.MAINNET,
  Network.TESTNET,
  Network.DEVNET,
  Network.LOCAL,
  Network.CUSTOM,
] as const;

export const ENABLED_CHAINS = [
  Network.TESTNET,
  Network.DEVNET,
  Network.LOCAL,
  Network.CUSTOM,
] as const;

export const chainName = {
  [Network.MAINNET]: 'Aptos - Mainnet',
  [Network.TESTNET]: 'Aptos - Testnet',
  [Network.DEVNET]: 'Aptos - Devnet',
  [Network.LOCAL]: 'Aptos - Local',
  [Network.CUSTOM]: 'Aptos - Custom',
};
