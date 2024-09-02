import type { Metadata } from "next";
import localFont from "next/font/local";
import { type PropsWithChildren } from "react";
import { Providers } from './providers'

import "nes.css/css/nes.min.css";
import "./globals.css";

const kongtext = localFont({
  src: "./../../public/kongtext.ttf",
  variable: "--font-kongtext",
});

export const metadata: Metadata = {
  title: "Boilerplate",
  description: "Your new favorite on-chain pet",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={kongtext.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
