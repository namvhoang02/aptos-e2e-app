'use client';

import {
  type InputGenerateTransactionPayloadData,
  type MoveStructId,
} from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { memo, useCallback, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { getTxUrl } from '@/lib/chain';
import { MODULE_ADDRESS } from '@/lib/constants';
import { useWriteContract } from '@/lib/hooks/contract/useWriteContract';

import { useLandingContext } from '@/components/landing/context/selectors';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

import { useClient } from '@/providers/ClientProvider';

import formSchema from './form-schema';

// Default values for the form
const DEFAULT_VALUES = {
  title: '',
};

const functionName: MoveStructId = `${MODULE_ADDRESS}::todolist::create_task`;

type FormSchemaType = z.infer<typeof formSchema>;

const AddNewTaskModal = memo(({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const { state, addTask } = useLandingContext();
  const [open, setOpen] = useState(false);
  const { account, network } = useWallet();

  const { client } = useClient();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: DEFAULT_VALUES,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  const handleError = (message: string) => {
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
  };

  const onSuccess = useCallback(
    (hash: string, payload: InputGenerateTransactionPayloadData) => {
      const {
        functionArguments: [title],
      } = payload;
      addTask?.({
        id: `${state.list.length + 1}`,
        title: title as string,
        status: 'backlog',
      });

      reset(DEFAULT_VALUES);
      setOpen(false);
      toast({
        title: 'Task created successfully!',
        description: (
          <a target='_blank' href={getTxUrl(hash, network?.name)}>
            View transaction on AptosScan
          </a>
        ),
      });
    },
    [state.list.length, addTask, reset, setOpen, toast, network?.name],
  );

  const onError = useCallback((e: unknown) => {
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred';
    handleError(errorMessage);
  }, []);

  const { data: hash, createContractAsync } = useWriteContract({
    onError,
    onSuccess,
  });

  console.log(hash, 'hash');

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    if (!client) {
      handleError(
        'Client not initialized. Please ensure the client is correctly configured.',
      );
      return;
    }

    if (!account?.address) {
      handleError(
        'No account address found. Please connect your wallet and try again.',
      );
      return;
    }

    try {
      await createContractAsync({
        function: functionName,
        functionArguments: [`${data.title}`],
      });
    } catch (error) {
      handleError('Failed to create task. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className='sm:max-w-[425px]'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create a new task</DialogTitle>
              <DialogDescription>
                Create a new task to track your progress.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='my-3'>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Title'
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-red-600 dark:text-red-500' />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                className='py-3 px-4 inline-flex justify-center items-center'
                type='submit'
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? 'Submitting...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

AddNewTaskModal.displayName = 'AddNewTaskModal';

export { AddNewTaskModal };
