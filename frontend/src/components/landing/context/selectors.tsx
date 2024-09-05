import * as React from 'react';

import LandingContext from './Context';
import { type InitialLandingState } from './types';

export const useLandingContext = (): {
  state: InitialLandingState;
  dispatch: React.Dispatch<any>;
} => {
  const contextValue = React.useContext(LandingContext);
  return contextValue;
};
