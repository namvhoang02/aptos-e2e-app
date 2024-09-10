import { client } from "./utils";
import { MODULE_ADDRESS } from "./config";
import { getAccount } from "./account";
import { type Task } from "./types";

export async function getTaskTableHandle() {
  const account = await getAccount();

  const todoListResource = await client.getAccountResource({
    accountAddress: account.accountAddress,
    resourceType: `${MODULE_ADDRESS}::todolist::TodoList`
  });

  // tasks table handle
  const tableHandle = (todoListResource as any).tasks.handle;
  // tasks table counter
  const taskCounter = (todoListResource as any).task_counter;

  let tasks: Task[] = [];
  let counter = 1;
  while (counter <= taskCounter) {
    try {
      const tableItem = {
        key_type: "u64",
        value_type: `${MODULE_ADDRESS}::todolist::Task`,
        key: `${counter}`,
      };
      const task = await client.getTableItem<Task>({ handle: tableHandle, data: tableItem });
      tasks.push(task);
    } catch (error: any) {
      console.error (error.message);
    } finally {
      counter++;
    }
  }

  return tasks;
}