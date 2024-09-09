'use client';

import {
  Ed25519PublicKey,
  InputGenerateTransactionPayloadData,
} from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { getAptosClient } from '@/lib/aptosClient';
import { MODULE_ADDRESS } from '@/lib/constants';
import { useLandingContext } from '@/components/landing/context/selectors';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import formSchema from './form-schema';

// Default values for the form
const DEFAULT_VALUES = {
  title: '',
};

type FormSchemaType = z.infer<typeof formSchema>;

export function DataTableNewOptions() {
  const { state, addTask } = useLandingContext();
  const [open, setOpen] = useState(false);
  const { account, signAndSubmitTransaction } = useWallet();
  const client = getAptosClient();

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

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    if (!account?.address) {
      console.error('No account address available.');
      return;
    }

    try {
      // Build transaction payload
      const payload: InputGenerateTransactionPayloadData = {
        function: `${MODULE_ADDRESS}::todolist::create_task`,
        functionArguments: [data.title],
      };

      // Build raw transaction
      const rawTxn = await client.transaction.build.simple({
        sender: account.address,
        data: payload,
      });

      // Simulate transaction to estimate gas
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
        console.error('Simulation failed');
        return;
      }

      // Prepare transaction with gas estimates
      const pendingTxn = await signAndSubmitTransaction({
        data: payload,
        options: {
          maxGasAmount: Math.ceil(Number(simulationResult.gas_used) * 1.2),
          gasUnitPrice: Number(simulationResult.gas_unit_price),
        },
      });

      // Wait for transaction confirmation
      const response = await client.waitForTransaction({
        transactionHash: pendingTxn.hash,
      });

      if (response?.success) {
        console.log({ hash: pendingTxn.hash, result: response });
        addTask && addTask({
          id: `${state.list.length + 1}`,
          title: data.title,
          status: 'backlog',
        });
        setOpen(false);
        reset(DEFAULT_VALUES);
      } else {
        console.error(`Transaction failed: ${response.vm_status}`);
      }
    } catch (error: any) {
      console.error('Transaction error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto hidden h-8 lg:flex">
          <Plus className="mr-2 h-4 w-4" />
          New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
              name="title"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Title"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 dark:text-red-500" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                className="py-3 px-4 inline-flex justify-center items-center"
                type="submit"
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
}
