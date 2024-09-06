"use client"

import { Ed25519PublicKey, InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from "lucide-react";
import * as React from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { getAptosClient } from "@/lib/aptosClient"
// import { useToast } from "@/components/ui/use-toast";
import { MODULE_ADDRESS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const defaultValues = {
  title: '',
};

// const id = 'login-form';

type FormSchemaType = z.infer<typeof formSchema>;

// interface DataTableNewOptionsProps<TData> {}
// export function DataTableNewOptions<TData>({
//   table,
// }: DataTableNewOptionsProps<TData>) {
export function DataTableNewOptions() {
  // const { toast } = useToast();

  const { account, signAndSubmitTransaction } = useWallet();

  const client = getAptosClient();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit: SubmitHandler<FormSchemaType> = async (
    data: FormSchemaType
  ) => {
    if (!account?.address) {
      console.error('No account address available.');
      return; // Return early if account address is undefined
    }
    try {
      // build transaction
      const payload: InputGenerateTransactionPayloadData = {
        function: `${MODULE_ADDRESS}::todolist::create_task`,
        functionArguments: [data.title]
      };
      const rawTxn = await client.transaction.build.simple({
        sender: account.address,
        data: payload,
      });

      const publicKey = new Ed25519PublicKey(account.publicKey.toString())
      const userTransaction = await client.transaction.simulate.simple({
        signerPublicKey: publicKey,
        transaction: rawTxn,
        options: { estimateGasUnitPrice: true, estimateMaxGasAmount: true, estimatePrioritizedGasUnitPrice: true },
      })

      const pendingTxn = await signAndSubmitTransaction({
        data: payload,
        options: {
          maxGasAmount: parseInt(String(Number(userTransaction[0].gas_used) * 1.2)),
          gasUnitPrice: Number(userTransaction[0].gas_unit_price),
        },
      });

      const response = await client.waitForTransaction({
        transactionHash: pendingTxn.hash,
      })
      if (response && response?.success) {
        console.log({ hash: pendingTxn?.hash, result: response });
      } else {
        console.log({ message: response.vm_status || 'Transaction error!' });
      }
    } catch (error: any) {
      console.log(error);
    }

    // if (error) {
    //   toast({
    //     variant: 'destructive',
    //     description: error.message,
    //   });
    // } else {
    //   reset(defaultValues);
    //   toast({
    //     title: "You're Almost There!",
    //     description:
    //       'Just one more step! Please check your email to log in and start using our service.',
    //   });
    // }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
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
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
