// import { useChainId } from 'wagmi';
import Debug from 'debug';
import React, { useMemo, useReducer } from 'react';

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

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <LandingContext.Provider value={contextValue}>
      {children}
    </LandingContext.Provider>
  );
};

export default React.memo(LandingProvider);
