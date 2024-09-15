'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useCallback, useEffect } from 'react';

import { HTTP_STATUS } from '@/lib/constants';
import { MODULE_ADDRESS } from '@/lib/constants';
import { hasTodoList } from '@/lib/hooks/Todolist/functions/hasTodoList';

import { useClient } from '@/providers/ClientProvider';

import { useLandingContext } from '../context/selectors';
import { type Task } from '../context/types';

function convertTask(task: any): Task {
  return {
    id: task.task_id,
    title: task.content,
    status: task.completed ? 'done' : 'backlog',
  };
}

const FetchListData = () => {
  const {
    state,
    fetchListSuccess,
    fetchListRequest,
    fetchListFailure,
    updateHasTodoList,
  } = useLandingContext(); // Get state and dispatch function from context
  const { account, network } = useWallet();
  const { client } = useClient();

  const fetchData = useCallback(async () => {
    if (!client) {
      console.error(
        'Client not initialized. Please ensure the client is correctly configured.',
      );
      return;
    }

    if (!account?.address) {
      console.error(
        'No account address found. Please connect your wallet and try again.',
      );
      return; // Return early if account address is undefined
    }

    try {
      // https://aptos.dev/en/build/apis/fullnode-rest-api
      const hasTodoListRes = await hasTodoList({
        client,
        address: account.address,
      });

      updateHasTodoList && updateHasTodoList(hasTodoListRes);
      if (!hasTodoListRes) return;

      const todoListResource = await client.getAccountResource({
        accountAddress: account.address, // Now guaranteed to be defined
        resourceType: `${MODULE_ADDRESS}::todolist::TodoList`,
      });

      // tasks table handle
      const tableHandle = (todoListResource as any).tasks.handle;

      // tasks table counter
      const taskCounter = (todoListResource as any).task_counter;

      const tasks: Task[] = [];
      let counter = 1;
      while (counter <= taskCounter) {
        try {
          const tableItem = {
            key_type: 'u64',
            value_type: `${MODULE_ADDRESS}::todolist::Task`,
            key: `${counter}`,
          };
          const task = await client.getTableItem<Task>({
            handle: tableHandle,
            data: tableItem,
          });
          tasks.push(convertTask(task));
        } catch (error: any) {
          console.error(error.message);
        } finally {
          counter += 1;
        }
      }
      fetchListSuccess && fetchListSuccess(tasks);
    } catch (error) {
      console.log(error, 'error');
      fetchListFailure && fetchListFailure(error); // Dispatch failure action with error
    }
  }, [account, client, fetchListFailure, fetchListSuccess]);

  useEffect(() => {
    if (state.fetchStatus === HTTP_STATUS.LOADING && client) {
      fetchData(); // Fetch data when fetch status is loading
    }
  }, [state.fetchStatus, fetchData, client]);

  useEffect(() => {
    if (state.fetchStatus === null && client) {
      fetchListRequest && fetchListRequest();
    }
  }, [state.fetchStatus, client]);

  // Case 1: change networks
  useEffect(() => {
    if (state.fetchStatus === HTTP_STATUS.LOADED && network) {
      fetchListRequest && fetchListRequest();
    }
  }, [network]);

  // Case 2: change accounts
  useEffect(() => {
    if (state.fetchStatus === HTTP_STATUS.LOADED && account) {
      fetchListRequest && fetchListRequest();
    }
  }, [account]);

  return null; // This component doesn't render anything visible
};

export default FetchListData;
