// import { AccountAddress, Aptos } from '@aptos-labs/ts-sdk';
import { Aptos } from '@aptos-labs/ts-sdk';

import { MODULE_ADDRESS } from '@/lib/constants';

// Interface for the 'GetPaused' function inputs
export interface HasTodoList {
  client: Aptos;
  address: string;
}

// Function to attempt fetching paused state (might return undefined)
export async function hasTodoList({ client, address }: HasTodoList) {
  const [hasTodoListRes] = await client.view<[boolean]>({
    payload: {
      function: `${MODULE_ADDRESS}::todolist::has_todo_list`,
      typeArguments: [],
      functionArguments: [address],
    },
  });

  return hasTodoListRes;
}
