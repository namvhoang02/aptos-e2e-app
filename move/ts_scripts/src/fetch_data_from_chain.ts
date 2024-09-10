// npx ts-node ./src/fetch_data_from_chain.ts
import { type Task } from "./types";
import { getTaskTableHandle } from "./get_task_table";

async function main() {
  let tasks: Task[] = await getTaskTableHandle();
  console.log(tasks);
}

main();