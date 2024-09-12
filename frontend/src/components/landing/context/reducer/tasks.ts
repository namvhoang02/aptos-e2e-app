import { HTTP_STATUS } from '@/lib/constants';
import { type Action } from '@/lib/middlewares/types';

import { type InitialLandingState, type Task } from '../types';

export const handleListRequest = (
  state: InitialLandingState,
): InitialLandingState => ({
  ...state,
  fetchStatus: HTTP_STATUS.LOADING,
  errors: null,
});

export const handleListSuccess = (
  state: InitialLandingState,
  action: Action<Task[]> | undefined,
): InitialLandingState => {
  if (!action) {
    return state;
  }

  const tasks = action.payload;
  if (!tasks) {
    return state;
  }
  const list: string[] = [];
  const data: Record<string, Task> = {};

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task && task.id) {
      list.push(task.id);
      data[task.id] = task;
    }
  }

  return {
    ...state,
    fetchStatus: HTTP_STATUS.LOADED,
    errors: null,
    list,
    data,
  };
};

export const handleListFailure = (
  state: InitialLandingState,
  action: Action<any>,
): InitialLandingState => ({
  ...state,
  fetchStatus: HTTP_STATUS.FAILED,
  errors: action.payload,
});

export const handleCompleteTask = (
  state: InitialLandingState,
  action: Action<string> | undefined,
): InitialLandingState => {
  if (!action || !action.payload) {
    return state;
  }

  const id = action.payload;

  // Check if the task exists in the state data before updating
  if (!state.data[id]) {
    return state;
  }

  return {
    ...state,
    data: {
      ...state.data,
      [id]: {
        ...state.data[id],
        status: 'done',
      },
    },
  };
};

export const handleAddTask = (
  state: InitialLandingState,
  action: Action<Task> | undefined,
): InitialLandingState => {
  if (!action || !action.payload) {
    return state;
  }

  const task = action.payload;

  // If the task already exists, keep the state unchanged
  if (state.data[task.id]) {
    return state;
  }

  // Add the new task to the list and data
  const newList = [...state.list, task.id];
  const newData = {
    ...state.data,
    [task.id]: task,
  };

  return {
    ...state,
    list: newList,
    data: newData,
  };
};

export const handleDeleteTask = (
  state: InitialLandingState,
  action: Action<Task> | undefined,
): InitialLandingState => {
  if (!action?.payload || !state.list.includes(action.payload.id)) {
    return state;
  }

  const taskId = action.payload.id;

  // Create an updated list of task IDs, filtering out the deleted task's ID
  const updatedTaskList = state.list.filter((id) => id !== taskId);

  // Create a new copy of the task data without the deleted task
  const updatedTaskData = { ...state.data };
  delete updatedTaskData[taskId];

  return {
    ...state,
    list: updatedTaskList,
    data: updatedTaskData,
  };
};

export const updateHasTodoList = (
  state: InitialLandingState,
  action: Action<boolean> | undefined,
): InitialLandingState => {
  if (!action || action.payload === undefined) {
    return state;
  }

  const hasTodoList = action.payload;

  return {
    ...state,
    fetchStatus: hasTodoList ? state.fetchStatus : HTTP_STATUS.LOADED,
    errors: null,
    hasTodoList,
  };
};
