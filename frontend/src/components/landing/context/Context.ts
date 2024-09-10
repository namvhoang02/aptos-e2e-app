// https://stackoverflow.com/questions/57298149/react-ts-usecontext-usereducer-hook
import { type Dispatch, createContext } from 'react';

import { type InitialLandingState, type Task } from './types';

// Create context with initial values
const LandingContext = createContext<{
  state: InitialLandingState;
  dispatch: Dispatch<any>; // Adjust any to your action types if known
  completeTask?: (id: string) => void;
  addTask?: (data: Task) => void;
  fetchListSuccess?: (data: Task[]) => void;
  deleteTask?: (data: Task) => void;
}>({
  state: {} as InitialLandingState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {}, // Default dispatch function
});

export default LandingContext;
