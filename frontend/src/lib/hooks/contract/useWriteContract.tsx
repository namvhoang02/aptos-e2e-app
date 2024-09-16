//
// https://aptos.web3doc.top/guides/basics-life-of-txn/
// https://aptos.dev/en/network/blockchain/blockchain-deep-dive#the-journey

//
// https://wagmi.sh/react/api/hooks/useWriteContract#usewritecontract
// https://github.com/wevm/wagmi/blob/main/packages/react/src/hooks/useWriteContract.ts
// https://aptos-labs.github.io/aptos-ts-sdk/@aptos-labs/ts-sdk-1.12.2/classes/Aptos.html#waitForTransaction
// https://aptos.dev/en/build/sdks/ts-sdk/building-transactions
'use client';

import {
  Ed25519PublicKey,
  InputGenerateTransactionPayloadData,
} from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { type UseMutationOptions, useMutation } from '@tanstack/react-query';

import { useClient } from '@/providers/ClientProvider';

export const useWriteContract = <
  TData = unknown,
  TError = unknown,
  TContext = unknown,
>(
  parameters: UseMutationOptions<
    TData,
    TError,
    InputGenerateTransactionPayloadData,
    TContext
  >,
) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const { client } = useClient();

  const { mutate, mutateAsync, ...result } = useMutation({
    ...parameters,
    mutationFn: async (payload: InputGenerateTransactionPayloadData) => {
      if (!client) {
        throw new Error(
          'Client not initialized. Please ensure the client is correctly configured.',
        );
      }

      if (!account?.address) {
        throw new Error(
          'No account address found. Please connect your wallet and try again.',
        );
      }

      // Step 1: Build transaction
      const rawTxn = await client.transaction.build.simple({
        sender: account.address,
        data: payload,
      });

      // Step 2: Simulate transaction to estimate gas
      const publicKey = new Ed25519PublicKey(account.publicKey.toString());
      const [simulationResult] = await client.transaction.simulate.simple({
        signerPublicKey: publicKey,
        transaction: rawTxn,
        options: {
          estimateGasUnitPrice: true,
          estimateMaxGasAmount: true,
          estimatePrioritizedGasUnitPrice: true,
        },
      });

      if (!simulationResult) {
        throw new Error(
          'Transaction simulation failed. Please check your network or try again later.',
        );
      }

      // Step 3: Prepare transaction with gas estimates
      const pendingTxn = await signAndSubmitTransaction({
        data: payload,
        options: {
          maxGasAmount: Math.ceil(Number(simulationResult.gas_used) * 0.9),
          // maxGasAmount: Math.ceil(Number(simulationResult.gas_used) * 1.2),
          gasUnitPrice: Number(simulationResult.gas_unit_price),
        },
      });

      // Step 4: Wait for transaction confirmation
      const response = await client.waitForTransaction({
        transactionHash: pendingTxn.hash,
      });

      if (response?.success) {
        return pendingTxn.hash;
      } else {
        throw new Error(
          `Transaction failed: ${response.vm_status}. Please review the transaction details and try again.`,
        );
      }
    },
  });

  return {
    ...result,
    createContract: mutate,
    createContractAsync: mutateAsync,
  };
};
