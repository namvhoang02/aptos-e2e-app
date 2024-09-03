import { type Metadata } from "next";
import { type PropsWithChildren } from "react";
import { cn } from "@/lib/utils"
import { fontSans } from "@/lib/fonts"

import "./globals.css";

import { Providers } from './providers'

export const metadata: Metadata = {
  title: "Boilerplate",
  description: "Your new favorite on-chain pet",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
