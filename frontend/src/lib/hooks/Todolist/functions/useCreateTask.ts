//
// https://aptos.web3doc.top/guides/basics-life-of-txn/
// https://aptos.dev/en/network/blockchain/blockchain-deep-dive#the-journey

//
// https://wagmi.sh/react/api/hooks/useWriteContract#usewritecontract
// https://aptos-labs.github.io/aptos-ts-sdk/@aptos-labs/ts-sdk-1.12.2/classes/Aptos.html#waitForTransaction
// https://aptos.dev/en/build/sdks/ts-sdk/building-transactions
'use client';

import {
  Ed25519PublicKey,
  MoveStructId,
  InputGenerateTransactionPayloadData,
} from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
// // Type for contracts to call for withdrawing credits
// export type UseWithdrawCreditsContracts = {
//   chainId: SupportedChainId;
// };
// // Function to construct the contract data for withdrawing credits
// export function useWithdrawCreditsContracts({ chainId }: UseWithdrawCreditsContracts) {
//   const address = getContractAddress(chainId, BOSS_REFERRAL_NETWORK_ADDRESS);
//   return {
//     chainId,
//     abi, // Use the withdrawCredits ABI
//     address, // Target the specific contract's address
//     functionName: 'withdrawCredits', // Call the withdrawCredits function
//   };
// }
// export type UseWithdrawCredits = UseWithdrawCreditsContracts & UseWriteContractParameters & {};
import { type UseMutationOptions, useMutation } from '@tanstack/react-query';

import { MODULE_ADDRESS } from '@/lib/constants';

import { useClient } from '@/providers/ClientProvider';

// export type UseMutationParameters<
//   data = unknown,
//   error = Error,
//   variables = void,
//   context = unknown,
// > = Evaluate<
//   Omit<
//     UseMutationOptions<data, error, Evaluate<variables>, context>,
//     'mutationFn' | 'mutationKey' | 'throwOnError'
//   >
// >
// export type UseWriteContractParameters

export const useCreateTask = <
  TData = unknown,
  TError = unknown,
  TContext = unknown,
>(
  parameters: UseMutationOptions<TData, TError, string, TContext>, // Explicitly set TVariables to string
) => {
  const functionName: MoveStructId = `${MODULE_ADDRESS}::todolist::create_task`;
  const { account, signAndSubmitTransaction } = useWallet();
  const { client } = useClient();

  const { mutate, mutateAsync, ...result } = useMutation({
    ...parameters,
    mutationFn: async (title: string) => {
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
      const payload: InputGenerateTransactionPayloadData = {
        function: functionName,
        functionArguments: [`${title}`],
      };

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
          maxGasAmount: Math.ceil(Number(simulationResult.gas_used) * 1.2),
          gasUnitPrice: Number(simulationResult.gas_unit_price),
        },
      });

      // Step 4: Wait for transaction confirmation
      const response = await client.waitForTransaction({
        transactionHash: pendingTxn.hash,
      });

      console.log(response, 'response');

      const intervalID = setInterval(
        async (hash: string) => {
          const res = await client.getTransactionByHash({
            transactionHash: hash,
          });
          console.log(res, 'getTransactionByHash');
        },
        500,
        pendingTxn.hash,
      );

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
    createTask: mutate,
    createTaskAsync: mutateAsync,
  };
};

// how to use

// const {
//   writeContract,
//   isLoading: isWritePending,
//   data: hash,
//   error,
//   status: isWriteStatus,
// } = useWriteContract({
//   mutation: {
//     onSuccess,
//     onError,
//   },
// });
