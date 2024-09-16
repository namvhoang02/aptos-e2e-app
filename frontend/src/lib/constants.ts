import { Network } from '@aptos-labs/ts-sdk';

export const SITENAME = 'Aptos E2E Dapp';
export const SITELINK = 'https://aptos-e2e-dapp.vercel.app';

// 1. Get projectId at https://cloud.walletconnect.com
export const projectId = '99fa41e98993063cfe2804d67160c39a';

// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
// Define an enum for HTTP status states
// HTTP REQUEST STATE
// FOR FETCHING DATA
export enum HTTP_STATUS {
  LOADING = 'HTTP_LOADING',
  LOADED = 'HTTP_LOADED',
  FAILED = 'HTTP_FAILED',
}

// FOR TRANSACTION DATA
export enum TRANSACTION_STATUS {
  // This constant represents the state where the transaction is being prepared before submission (value: 'preparing').
  PREPARING = 'preparing',
  // This constant represents the initial state before a transaction is submitted (value: 'idle').
  IDLE = 'idle',
  // This indicates the transaction has been submitted and is waiting for confirmation (value: 'pending').
  PENDING = 'pending',
  // This signifies the transaction was successfully mined and included in a block on the blockchain (value: 'confirmed').
  CONFIRMED = 'confirmed', // Explicit state for confirmed transaction
  // This means the transaction wasn't mined successfully, possibly due to insufficient gas or other reasons (value: 'failed').
  FAILED = 'failed', // Separate state for failed transactions
  // This indicates an unexpected error occurred during the transaction submission process (value: 'error').
  ERROR = 'error', // For unexpected errors during submission
}

export const TRANSACTION_PROCESSING = [
  TRANSACTION_STATUS.PREPARING,
  TRANSACTION_STATUS.IDLE,
  TRANSACTION_STATUS.PENDING,
];

export const TRANSACTION_CONFIRMED = [
  TRANSACTION_STATUS.CONFIRMED,
  TRANSACTION_STATUS.FAILED,
  TRANSACTION_STATUS.ERROR,
];

export const MODULE_ADDRESS =
  '0x7654fd0be5bfa9e6eb080229eab8cbb746022fe3ba5cb302fef2d8985d666966';

export const PREFERRED_CHAIN = Network.TESTNET;

export const RECOMMENDED_WALLETS = ['Petra'];
