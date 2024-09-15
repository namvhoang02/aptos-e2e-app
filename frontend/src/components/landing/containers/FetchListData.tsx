'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useCallback, useEffect } from 'react';

import { HTTP_STATUS, MODULE_ADDRESS } from '@/lib/constants';
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
  } = useLandingContext();
  const { account, network } = useWallet();
  const { client } = useClient();

  // Fetch data logic encapsulated within a useCallback hook to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    if (!client || !account?.address) {
      console.error(
        'Client or account not initialized. Please check wallet connection.',
      );
      return;
    }

    try {
      // Check if the user has a TodoList
      const hasTodoListRes = await hasTodoList({
        client,
        address: account.address,
      });
      updateHasTodoList?.(hasTodoListRes);

      if (!hasTodoListRes) return; // No TodoList, exit early

      // Fetch the TodoList resource from the blockchain
      const todoListResource = await client.getAccountResource({
        accountAddress: account.address,
        resourceType: `${MODULE_ADDRESS}::todolist::TodoList`,
      });

      const tableHandle = todoListResource.tasks.handle;
      const taskCounter = todoListResource.task_counter;

      const tasks: Task[] = [];
      for (let counter = 1; counter <= taskCounter; counter++) {
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
          console.error(`Error fetching task ${counter}:`, error.message);
        }
      }

      fetchListSuccess?.(tasks); // Dispatch success with the fetched tasks
    } catch (error) {
      console.error('Failed to fetch TodoList:', error);
      fetchListFailure?.(error); // Dispatch failure with error
    }
  }, [
    client,
    account?.address,
    updateHasTodoList,
    fetchListSuccess,
    fetchListFailure,
  ]);

  // Trigger fetch when the fetch status is 'LOADING'
  useEffect(() => {
    if (state.fetchStatus === HTTP_STATUS.LOADING && client) {
      fetchData();
    }
  }, [state.fetchStatus, client, fetchData]);

  // Request fetch when fetch status is null (initial load)
  useEffect(() => {
    if (state.fetchStatus === null && client) {
      fetchListRequest?.();
    }
  }, [state.fetchStatus, client, fetchListRequest]);

  // Handle both network and account changes
  useEffect(() => {
    if (state.fetchStatus === HTTP_STATUS.LOADED && (account || network)) {
      fetchListRequest?.();
    }
  }, [account, network, state.fetchStatus, fetchListRequest]);

  return null; // This component doesn't render any UI elements
};

export default FetchListData;
