'use client';

import {
  Aptos,
  Ed25519PublicKey,
  InputGenerateTransactionPayloadData,
} from '@aptos-labs/ts-sdk';
import { AccountInfo, useWallet } from '@aptos-labs/wallet-adapter-react';
import { Row } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';

import { MODULE_ADDRESS } from '@/lib/constants';

import { useLandingContext } from '@/components/landing/context/selectors';
import { taskSchema } from '@/components/landing/context/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useClient } from '@/providers/ClientProvider';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { completeTask, deleteTask } = useLandingContext();
  const task = taskSchema.parse(row.original);
  const { account, signAndSubmitTransaction } = useWallet();
  const { client } = useClient();

  const handleCompleteTask = async () => {
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

    try {
      const transactionHash = await buildAndSubmitTransaction(
        account,
        BigInt(task.id),
        client,
        'complete_task',
      );
      if (transactionHash) {
        completeTask && completeTask(task.id);
        console.log(`Task completed with transaction hash: ${transactionHash}`);
      }
    } catch (error: any) {
      console.error('Transaction failed:', error.message);
    }
  };

  const handleDeleteTask = async () => {
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

    try {
      const transactionHash = await buildAndSubmitTransaction(
        account,
        BigInt(task.id),
        client,
        'delete_task', // Use the appropriate function name for deleting tasks
      );
      if (transactionHash) {
        deleteTask && deleteTask(task);
        console.log(`Task deleted with transaction hash: ${transactionHash}`);
      }
    } catch (error: any) {
      console.error('Transaction failed:', error.message);
    }
  };

  const buildAndSubmitTransaction = async (
    account: AccountInfo,
    taskId: bigint,
    client: Aptos,
    actionType: 'complete_task' | 'delete_task',
  ) => {
    try {
      const payload: InputGenerateTransactionPayloadData = {
        function: `${MODULE_ADDRESS}::todolist::${actionType}`,
        functionArguments: [taskId],
      };

      const rawTxn = await client.transaction.build.simple({
        sender: account.address,
        data: payload,
      });

      const publicKey = new Ed25519PublicKey(account.publicKey.toString());
      const [userTransaction] = await client.transaction.simulate.simple({
        signerPublicKey: publicKey,
        transaction: rawTxn,
        options: {
          estimateGasUnitPrice: true,
          estimateMaxGasAmount: true,
          estimatePrioritizedGasUnitPrice: true,
        },
      });

      const maxGasAmount = parseInt(
        (Number(userTransaction.gas_used) * 1.2).toString(),
      );
      const gasUnitPrice = Number(userTransaction.gas_unit_price);

      const pendingTxn = await signAndSubmitTransaction({
        data: payload,
        options: {
          maxGasAmount,
          gasUnitPrice,
        },
      });

      const response = await client.waitForTransaction({
        transactionHash: pendingTxn.hash,
      });

      if (response?.success) {
        return pendingTxn.hash;
      } else {
        throw new Error(response.vm_status || 'Transaction failed.');
      }
    } catch (error: any) {
      console.error('Error during transaction:', error.message);
      throw error;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <Ellipsis className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {/* <DropdownMenuItem>Edit</DropdownMenuItem> */}
        {/* <DropdownMenuItem>Make a copy</DropdownMenuItem> */}
        <DropdownMenuItem onSelect={handleCompleteTask}>
          Complete task
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem onSelect={handleDeleteTask}>
          Delete task
          {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
