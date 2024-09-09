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
  if (!action) {
    return state;
  }
  const id = action.payload;
  if (!id) {
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

// export const handleWithdrawCreditsRequest = (
//   state: InitialLandingState,
//   action: Action<any>
// ): InitialLandingState => {
//   const currentRequest = state.credit.txhistories[state.credit.current];

//   // Check if there's a current request in progress
//   if (currentRequest && TRANSACTION_PROCESSING.includes(currentRequest.fetchStatus)) {
//     return state;
//   }

//   // Create a new transaction history entry
//   const newTxHistory = {
//     fetchStatus: TRANSACTION_STATUS.PREPARING,
//     errors: null,
//     hash: null,
//     amount: action?.payload?.amount,
//   };

//   // Update txhistories with the new entry
//   const updatedTxHistories = [...state.credit.txhistories, newTxHistory];

//   // Update the current index
//   const current = updatedTxHistories.length - 1;

//   // Return the updated state
//   return {
//     ...state,
//     credit: {
//       ...state.credit,
//       current,
//       txhistories: updatedTxHistories,
//     },
//   };
// };

// export const handleWithdrawCreditsPreparing = (
//   state: InitialLandingState,
//   action: Action<any>
// ): InitialLandingState => {
//   const currentRequest = state.credit.txhistories[state.credit.current];

//   // Ensure there is a current request in PREPARING state
//   if (!currentRequest || currentRequest.fetchStatus !== TRANSACTION_STATUS.PREPARING) {
//     return state;
//   }

//   // Create a new transaction history entry with updated fetchStatus and hash
//   const newTxHistory = {
//     ...currentRequest,
//     fetchStatus: TRANSACTION_STATUS.IDLE,
//     errors: null,
//     hash: action?.payload?.hash || null,
//     ts: action?.payload?.ts || new Date().getTime(),
//   };

//   // Clone the txhistories array and update the current request
//   const updatedTxHistories = state.credit.txhistories.map((history, index) =>
//     index === state.credit.current ? newTxHistory : history
//   );

//   // Return the updated state
//   return {
//     ...state,
//     credit: {
//       ...state.credit,
//       txhistories: updatedTxHistories,
//     },
//   };
// };

// export const handleWithdrawCreditsPending = (
//   state: InitialLandingState,
//   action: Action<any>
// ): InitialLandingState => {
//   const currentRequest = state.credit.txhistories[state.credit.current];

//   // Ensure there is a current request in IDLE state
//   if (!currentRequest || currentRequest.fetchStatus !== TRANSACTION_STATUS.IDLE) {
//     return state;
//   }

//   // Create a new transaction history entry with updated fetchStatus and hash
//   const newTxHistory = {
//     ...currentRequest,
//     fetchStatus: TRANSACTION_STATUS.PENDING,
//     errors: null,
//     hash: action?.payload?.hash || null,
//     ts: action?.payload?.ts || new Date().getTime(),
//   };

//   // Clone the txhistories array and update the current request
//   const updatedTxHistories = state.credit.txhistories.map((history, index) =>
//     index === state.credit.current ? newTxHistory : history
//   );

//   // Return the updated state
//   return {
//     ...state,
//     credit: {
//       ...state.credit,
//       txhistories: updatedTxHistories,
//     },
//   };
// };

// export const handleWithdrawCreditsSuccess = (
//   state: InitialLandingState,
//   action: Action<any>
// ): InitialLandingState => {
//   const currentRequest = state.credit.txhistories[state.credit.current];

//   // Ensure there is a current request in PENDING state
//   if (!currentRequest || currentRequest.fetchStatus !== TRANSACTION_STATUS.PENDING) {
//     return state;
//   }

//   // Create a new transaction history entry with updated fetchStatus
//   const newTxHistory = {
//     ...currentRequest,
//     fetchStatus: TRANSACTION_STATUS.CONFIRMED,
//     errors: null,
//   };

//   // Clone the txhistories array and update the current request
//   const updatedTxHistories = state.credit.txhistories.map((history, index) =>
//     index === state.credit.current ? newTxHistory : history
//   );
//   let { value } = state.credit;
//   if (action?.payload?.value) {
//     value -= action?.payload?.value;
//   }
//   // Return the updated state
//   return {
//     ...state,
//     credit: {
//       ...state.credit,
//       value,
//       txhistories: updatedTxHistories,
//     },
//   };
// };

// export const handleWithdrawCreditsFailure = (
//   state: InitialLandingState,
//   action: Action<any>
// ): InitialLandingState => {
//   const currentRequest = state.credit.txhistories[state.credit.current];

//   // Ensure there is a current request in PENDING state
//   if (!currentRequest || currentRequest.fetchStatus !== TRANSACTION_STATUS.PENDING) {
//     return state;
//   }

//   // Create a new transaction history entry with updated fetchStatus and error message
//   const newTxHistory = {
//     ...currentRequest,
//     fetchStatus: TRANSACTION_STATUS.FAILED,
//     errors: action?.payload || null,
//   };

//   // Clone the txhistories array and update the current request
//   const updatedTxHistories = state.credit.txhistories.map((history, index) =>
//     index === state.credit.current ? newTxHistory : history
//   );

//   // Return the updated state
//   return {
//     ...state,
//     credit: {
//       ...state.credit,
//       txhistories: updatedTxHistories,
//     },
//   };
// };

// export const handleWithdrawCreditsError = (
//   state: InitialLandingState,
//   action: Action<WriteContractErrorType>
// ): InitialLandingState => {
//   const currentRequest = state.credit.txhistories[state.credit.current];

//   // Ensure there is a current request in PENDING state
//   if (!currentRequest || currentRequest.fetchStatus !== TRANSACTION_STATUS.IDLE) {
//     return state;
//   }

//   // Create a new transaction history entry with updated fetchStatus and error message
//   const newTxHistory = {
//     ...currentRequest,
//     fetchStatus: TRANSACTION_STATUS.ERROR,
//     errors: action?.payload || null,
//   };

//   // Clone the txhistories array and update the current request
//   const updatedTxHistories = state.credit.txhistories.map((history, index) =>
//     index === state.credit.current ? newTxHistory : history
//   );

//   // Return the updated state
//   return {
//     ...state,
//     credit: {
//       ...state.credit,
//       txhistories: updatedTxHistories,
//     },
//   };
// };

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
