import { type Metadata } from 'next';
import { type PropsWithChildren } from 'react';

import './globals.css';

import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';

import { Toaster } from '@/components/ui/toaster';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Boilerplate',
  description: 'Your new favorite on-chain pet',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
