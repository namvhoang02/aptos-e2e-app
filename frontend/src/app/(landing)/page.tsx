"use client";

// import { promises as fs } from "fs"
// import { type Metadata } from "next";
import { useEffect } from 'react';

// import path from "path"
// import { z } from "zod"
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Ed25519PublicKey, InputViewFunctionData } from '@aptos-labs/ts-sdk';
import { Button } from "@/components/ui/button";
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"
// import { taskSchema } from "./data/schema"
import { WalletButtons } from "@/components/WalletButtons"
import { getAptosClient } from "@/lib/aptosClient"
import { MODULE_ADDRESS } from "@/lib/env";

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

type Task = {
  address: string;
  completed: boolean;
  content: string;
  task_id: string;
};

export default function TaskPage() {
  const { account, signAndSubmitTransaction } = useWallet();
  console.log(account, 'account 1');

  const client = getAptosClient();

  const fetchData = async () => {
    try {
      if (!account) {
        return;
      }

      const todoListResource = await client.getAccountResource({
        accountAddress: account.address,
        resourceType: `${MODULE_ADDRESS}::todolist::TodoList`
      });


      // tasks table handle
      const tableHandle = (todoListResource as any).tasks.handle;
      // tasks table counter
      const taskCounter = (todoListResource as any).task_counter;

      const tasks: Task[] = [];
      let counter = 1;
      while (counter <= taskCounter) {
        const tableItem = {
          key_type: "u64",
          value_type: `${MODULE_ADDRESS}::todolist::Task`,
          key: `${counter}`,
        };
        const task = await client.getTableItem<Task>({ handle: tableHandle, data: tableItem });
        tasks.push(task);
        counter++;
      }

      console.log(tasks, 'tasks');
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const createList = async () => {
    try {
      if (!account) {
        return;
      }
      // build transaction
      const payload = {
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
      const payload = {
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

  useEffect(() => {
    fetchData();
  }, [account, fetchData]);

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
        <DataTable data={[]} columns={columns} />
        <Button onClick={createList}>Create list</Button>
        <Button onClick={createTask}>Add task</Button>
        <Button>Complete task</Button>
      </div>
    </>
  )
}
