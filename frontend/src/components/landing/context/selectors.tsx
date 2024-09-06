'use client';

import React from 'react';

import LandingContext from './Context';

export const useLandingContext = () => {
  const contextValue = React.useContext(LandingContext);
  if (!contextValue)
    throw new Error(
      ['`useLandingContext` must be used within `LandingProvider`.'].join('\n'),
    );

  return contextValue;
};
