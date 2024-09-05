import React, { useMemo, useReducer } from 'react';
// import { useChainId } from 'wagmi';
import Debug from 'debug';
import useDidUpdateEffect from '@/lib/hooks/useDidUpdateEffect';
import LandingContext from './Context';
import { fetchListRequest } from './actions';
import reducerDefault, { generateInitialState } from './reducer';

const debug = Debug('views:landing:context:LandingProvider');

export interface LandingProviderProps {
  reducer?: React.Reducer<any, any>;
  children?: React.ReactNode;
  // FIXME: chuyen thanh support network id
  chainid: number;
}

const LandingProvider: React.FC<LandingProviderProps> = ({
  reducer = reducerDefault,
  children,
  chainid,
}: LandingProviderProps) => {
  debug('render');

  const [state, dispatch] = useReducer(
    reducer,
    generateInitialState({
      chainid,
    })
  );
  // const chainId = useChainId();

  useDidUpdateEffect(() => {
    dispatch(fetchListRequest());
  }, [chainid]);

  React.useEffect(() => {
    if (state.fetchStatus === null) {
      dispatch(fetchListRequest());
    }
  }, []);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <LandingContext.Provider value={contextValue}>{children}</LandingContext.Provider>;
};

export default React.memo(LandingProvider);
