'use client';

import {
  Ed25519PublicKey,
  InputGenerateTransactionPayloadData,
} from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useState } from 'react';

import { MODULE_ADDRESS } from '@/lib/constants';

import { useClient } from '@/providers/ClientProvider';

export const useCreateTodoList = (
  updateHasTodoList?: (hasTodoList: boolean) => void,
) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const { client } = useClient();
  const [loading, setLoading] = useState(false);

  const createList = async () => {
    if (!client) {
      console.error(
        'Client not initialized. Please ensure the client is correctly configured.',
      );
      return;
    }

    if (!account?.address) {
      console.error(
        'No account address found. Please connect your wallet and try again.',
      );
      return;
    }

    setLoading(true);
    try {
      // build transaction
      const payload: InputGenerateTransactionPayloadData = {
        function: `${MODULE_ADDRESS}::todolist::create_list`,
        functionArguments: [],
      };

      const rawTxn = await client.transaction.build.simple({
        sender: account.address,
        data: payload,
      });

      const userTransaction = await client.transaction.simulate.simple({
        signerPublicKey: new Ed25519PublicKey(account.publicKey.toString()),
        transaction: rawTxn,
        options: {
          estimateGasUnitPrice: true,
          estimateMaxGasAmount: true,
          estimatePrioritizedGasUnitPrice: true,
        },
      });

      const pendingTxn = await signAndSubmitTransaction({
        data: payload,
        options: {
          maxGasAmount: parseInt(
            String(Number(userTransaction[0].gas_used) * 1.2),
          ),
          gasUnitPrice: Number(userTransaction[0].gas_unit_price),
        },
      });

      const response = await client.waitForTransaction({
        transactionHash: pendingTxn.hash,
      });

      if (response && response?.success) {
        updateHasTodoList && updateHasTodoList(true);
      } else {
        throw new Error(response.vm_status || 'Transaction failed!');
      }
    } catch (error) {
      console.error('Failed to create todo list:', error);
    } finally {
      setLoading(false);
    }
  };

  return { createList, loading };
};
