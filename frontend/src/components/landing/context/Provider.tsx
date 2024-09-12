import Debug from 'debug';
import React, { useMemo, useReducer } from 'react';

import {
  addTask as addTaskAction,
  completeTask as completeTaskAction,
  deleteTask as deleteTaskAction,
  fetchListRequest as fetchListRequestAction,
  fetchListSuccess as fetchListSuccessAction,
  updateHasTodoList as updateHasTodoListAction,
} from './actions';
import LandingContext from './Context';
import reducerDefault, { generateInitialState } from './reducer';
import { type Task } from './types';

const debug = Debug('views:landing:context:LandingProvider');

export interface LandingProviderProps {
  reducer?: React.Reducer<any, any>;
  children?: React.ReactNode;
}

const LandingProvider: React.FC<LandingProviderProps> = ({
  reducer = reducerDefault,
  children,
}: LandingProviderProps) => {
  debug('render');

  const [state, dispatch] = useReducer(reducer, generateInitialState());

  const contextValue = useMemo(() => {
    const completeTask = (taskId: string) => {
      dispatch(completeTaskAction(taskId));
    };

    const addTask = (data: Task) => {
      dispatch(addTaskAction(data));
    };

    const fetchListSuccess = (data: Task[]) => {
      dispatch(fetchListSuccessAction(data));
    };

    const fetchListRequest = () => {
      dispatch(fetchListRequestAction());
    };

    const deleteTask = (data: Task) => {
      dispatch(deleteTaskAction(data));
    };

    const updateHasTodoList = (hasTodoList: boolean) => {
      dispatch(updateHasTodoListAction(hasTodoList));
    };

    return {
      state,
      dispatch,
      completeTask,
      addTask,
      fetchListSuccess,
      fetchListRequest,
      deleteTask,
      updateHasTodoList,
    };
  }, [state, dispatch]);

  return (
    <LandingContext.Provider value={contextValue}>
      {children}
    </LandingContext.Provider>
  );
};

export default React.memo(LandingProvider);
