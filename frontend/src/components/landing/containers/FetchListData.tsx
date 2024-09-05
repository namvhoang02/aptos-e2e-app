"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useCallback,useEffect } from 'react';

import { getAptosClient } from "@/lib/aptosClient";
import { HTTP_STATUS } from '@/lib/constants';
import { MODULE_ADDRESS } from "@/lib/constants";

import { fetchListFailure, fetchListRequest, fetchListSuccess } from '../context/actions';
import { useLandingContext } from '../context/selectors';
import { type Task } from "../context/types";

function convertTask(task: any): Task {
  return {
    id: task.task_id,
    title: task.content,
    status: task.completed ? 'done' : 'backlog',
  }
}

const FetchListData = () => {
  const { state, dispatch } = useLandingContext(); // Get state and dispatch function from context
  const { account } = useWallet();
  const client = getAptosClient();

  const fetchData = useCallback(async () => {
    try {
      if(!account) {
        return;
      }
      console.log('fetchData');
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
        tasks.push(convertTask(task));
        counter++;
      }
      dispatch(fetchListSuccess(tasks));
    } catch (error) {
      console.log(error, 'error');
      dispatch(fetchListFailure(error)); // Dispatch failure action with error
    }
  }, [account, dispatch]);

  useEffect(() => {
    if (state.fetchStatus === HTTP_STATUS.LOADING) {
      fetchData(); // Fetch data when fetch status is loading
    }
  }, [state.fetchStatus, fetchData]);

  useEffect(() => {
    if (state.fetchStatus === null) {
      dispatch(fetchListRequest());
    }
  }, [state.fetchStatus]);

  return null; // This component doesn't render anything visible
};

export default FetchListData;
