'use client';

import { type MoveStructId } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React, { memo, useCallback, useState } from 'react';

import { getTxUrl } from '@/lib/chain';
import { MODULE_ADDRESS } from '@/lib/constants';
import { useWriteContract } from '@/lib/hooks/contract/useWriteContract';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

import { useClient } from '@/providers/ClientProvider';
import { useLandingContext } from '@/components/landing/context/selectors';

// Move function for creating a list
const functionName: MoveStructId = `${MODULE_ADDRESS}::todolist::create_list`;

const AddNewListModal = memo(({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { account, network } = useWallet();
  const { updateHasTodoList } = useLandingContext();

  const { client } = useClient();

  const handleError = (message: string) => {
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
  };

  const onSuccess = useCallback(
    (hash: string) => {
      setOpen(false);
      toast({
        title: 'List created successfully!',
        description: (
          <a target='_blank' href={getTxUrl(hash, network?.name)}>
            View transaction on AptosScan
          </a>
        ),
      });
      updateHasTodoList && updateHasTodoList(true);
    },
    [setOpen, toast, network?.name],
  );

  const onError = useCallback((e: unknown) => {
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred';
    handleError(errorMessage);
  }, []);

  // Hook to write to the contract (create list)
  const { createContractAsync, isPending } = useWriteContract({
    onError,
    onSuccess,
  });

  // Function to handle list creation
  const handleCreateList = async () => {
    if (!client) {
      handleError(
        'Client is not initialized. Please ensure the client is properly configured.',
      );
      return;
    }

    if (!account?.address) {
      handleError(
        'Wallet not connected. Please connect your wallet and try again.',
      );
      return;
    }

    try {
      await createContractAsync({
        function: functionName,
        functionArguments: [],
      });
    } catch (error) {
      console.log(error, 'error');
      handleError('Failed to create the list. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create a new list</DialogTitle>
          <DialogDescription>
            Create a new list to manage your tasks and progress.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className='py-3 px-4 inline-flex justify-center items-center'
            onClick={handleCreateList}
            disabled={isPending}
          >
            {isPending ? 'Submitting...' : 'Creating list'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

AddNewListModal.displayName = 'AddNewListModal';

export { AddNewListModal };
