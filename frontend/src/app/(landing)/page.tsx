"use client";

// import { promises as fs } from "fs"
// import { type Metadata } from "next";
import { Ed25519PublicKey, InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';
// import path from "path"
// import { z } from "zod"
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import { getAptosClient } from "@/lib/aptosClient"
import { MODULE_ADDRESS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
// import { taskSchema } from "./data/schema"
import { WalletButtons } from "@/components/WalletButtons"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"

// export const metadata: Metadata = {
//   title: "Tasks",
//   description: "A task and issue tracker build using Tanstack Table.",
// }

// // Simulate a database read for tasks.
// async function getTasks() {
//   const data = await fs.readFile(
//     path.join(process.cwd(), "src/app/(landing)/data/tasks.json")
//   )

//   const tasks = JSON.parse(data.toString())

//   return z.array(taskSchema).parse(tasks)
// }

// import { client } from "./utils";
// import { getAccount } from "./account";
// import { type Task } from "./types";

export default function Page() {
  const { account, signAndSubmitTransaction } = useWallet();

  const client = getAptosClient();

  const createList = async () => {
    try {
      if (!account) {
        return;
      }
      // build transaction
      const payload: InputGenerateTransactionPayloadData = {
        function: `${MODULE_ADDRESS}::todolist::create_list`,
        functionArguments: []
      };
      const rawTxn = await client.transaction.build.simple({
        sender: account.address,
        data: payload,
      })

      const publicKey = new Ed25519PublicKey(account.publicKey.toString())
      const userTransaction = await client.transaction.simulate.simple({
        signerPublicKey: publicKey,
        transaction: rawTxn,
        options: { estimateGasUnitPrice: true, estimateMaxGasAmount: true, estimatePrioritizedGasUnitPrice: true },
      })

      console.log(userTransaction, 'userTransaction');

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
  }

  const createTask = async () => {
    try {
      if (!account) {
        return;
      }

      // build transaction
      const payload: InputGenerateTransactionPayloadData = {
        function: `${MODULE_ADDRESS}::todolist::create_task`,
        functionArguments: ["New Task"]
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

      console.log(userTransaction, 'userTransaction');

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
  }

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
            <WalletButtons />
          </div>
        </div>
        <DataTable columns={columns} />
        <Button onClick={createList}>Create list</Button>
        <Button onClick={createTask}>Add task</Button>
        <Button>Complete task</Button>
      </div>
    </>
  )
}
