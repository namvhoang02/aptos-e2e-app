// import { useChainId } from 'wagmi';
import Debug from 'debug';
import React, { useMemo, useReducer } from 'react';

import { completeTask as completeTaskAction } from './actions';
import LandingContext from './Context';
import reducerDefault, { generateInitialState } from './reducer';

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

    return {
      state,
      dispatch,
      completeTask,
    };
  }, [state, dispatch]);

  return (
    <LandingContext.Provider value={contextValue}>
      {children}
    </LandingContext.Provider>
  );
};

export default React.memo(LandingProvider);
