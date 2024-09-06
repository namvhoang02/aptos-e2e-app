'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';

import Navigation from '@/components/navigation';

// import { Connected } from "./Connected";
import { NotConnected } from './NotConnected';

export function Body() {
  const { connected } = useWallet();

  if (connected)
    return (
      <>
        <Navigation />
        {/* <Connected /> */}
      </>
    );

  return <NotConnected />;
}
