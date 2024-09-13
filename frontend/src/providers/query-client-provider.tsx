'use client';

import {
  QueryClient,
  QueryClientProvider as _QueryClientProvider,
} from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type FC, type ReactNode } from 'react';

// Create a client
const queryClient = new QueryClient();

export const QueryClientProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <_QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialonlyOpen={false} /> */}
    </_QueryClientProvider>
  );
};
