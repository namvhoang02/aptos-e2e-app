'use client';

// import { promises as fs } from "fs"
// import { type Metadata } from "next";
// import path from "path"
// import { z } from "zod"

import { useLandingContext } from '@/components/landing/context/selectors';
import { WalletButton } from '@/components/WalletButton';
// import { taskSchema } from "./data/schema"
import { WalletButtons } from '@/components/WalletButtons';
import { WalletMenu } from '@/components/WalletMenu';
import { Button } from '@/components/ui/button';
import { Connect } from '@/components/checker/Connect';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { UserNav } from './components/user-nav';
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
import { ConnectButton } from '@/components/user-profile/connect-button';
import { WalletAdapterModelDialog } from '@/components/wallet-adapter/WalletAdapterModelDialog';

export default function Page() {
  const { state } = useLandingContext(); // Get state and dispatch function from context

  const tasks = state.list.map((id: string) => state.data[id]);

  return (
    <>
      <div className='h-full flex-1 flex-col space-y-8 p-8'>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Welcome back!</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <UserNav />
            <WalletButtons />
            <ConnectButton />
          </div>
        </div>
        <DataTable
          fetchStatus={state.fetchStatus}
          data={tasks}
          columns={columns}
        />
        <WalletMenu />
        <WalletButton />

        <WalletAdapterModelDialog>
          <Button variant='outline' aria-label='Connect wallet'>
            Connect Wallet
          </Button>
        </WalletAdapterModelDialog>

        <Connect>
          Connected
        </Connect>
      </div>
    </>
  );
}
