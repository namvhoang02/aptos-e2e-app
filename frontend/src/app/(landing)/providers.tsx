'use client';

import React from 'react';
import LandingProvider from '@/components/landing/context/Provider';

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <LandingProvider>
      {children}
    </LandingProvider>
  )
}