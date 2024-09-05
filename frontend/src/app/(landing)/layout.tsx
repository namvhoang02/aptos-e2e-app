import { type PropsWithChildren } from "react";

import { Providers } from './providers'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Providers>{children}</Providers>
  );
}
