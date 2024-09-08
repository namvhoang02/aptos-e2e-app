'use client';

// import { promises as fs } from "fs"
// import { type Metadata } from "next";
// import path from "path"
// import { z } from "zod"

import { Connect } from '@/components/checker/Connect';
import { useLandingContext } from '@/components/landing/context/selectors';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/components/user-profile';
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
import { WalletAdapterModelDialog } from '@/components/wallet-adapter/WalletAdapterModelDialog';

// import { taskSchema } from "./data/schema"
// import { WalletButtons } from '@/components/WalletButtons';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { UserNav } from './components/user-nav';

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
            <Connect>
              <UserProfile />
            </Connect>
          </div>
        </div>
        <DataTable
          fetchStatus={state.fetchStatus}
          data={tasks}
          columns={columns}
        />
        <WalletAdapterModelDialog>
          <Button variant='outline' aria-label='Connect wallet'>
            Connect Wallet
          </Button>
        </WalletAdapterModelDialog>
      </div>
    </>
  );
}
