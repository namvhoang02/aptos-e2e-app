// npx ts-node ./src/delete_task.ts
import { client } from "./utils";
import { MODULE_ADDRESS } from "./config";
import { getAccount } from "./account";
import { getTaskTableHandle } from "./get_task_table";
import { type Task } from "./types";

async function main() {
  try {
    // get tasks from chain
    let tasks: Task[] = await getTaskTableHandle();

    // find task to delete (for this example, we delete the first task)
    const taskToDelete = tasks[0]; // Change this to your desired task selection logic

    if (!taskToDelete) {
      console.log('No task to delete');
      return;
    }
    
    // delete task
    const account = await getAccount();

    // build transaction
    const transaction = await client.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: `${MODULE_ADDRESS}::todolist::delete_task`,
        functionArguments: [taskToDelete?.task_id],
      },
    });

    // using sign and submit separately
    const senderAuthenticator = client.transaction.sign({ signer: account, transaction });
    const committedTransaction = await client.transaction.submit.simple({ transaction, senderAuthenticator });

    // wait for transaction
    const res = await client.waitForTransaction({ transactionHash: committedTransaction.hash });
    console.log(res);
  } catch (error: any) {
    console.log(error);
  }
}

main();
