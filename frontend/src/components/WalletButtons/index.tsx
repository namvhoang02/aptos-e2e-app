"use client";

import {
  isRedirectable,
  useWallet,
  Wallet,
  WalletName,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-react";
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

export const WalletButtons = (): any => {
  const { wallets, connected, disconnect, isLoading } = useWallet();

  if (connected) {
    return (
      <Button onClick={disconnect}>
        Disconnect
      </Button>
    );
  }

  if (isLoading || !wallets || !wallets[0]) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  // Narrow down to only Wallet type objects
  const wallet = wallets.find((w): w is Wallet => 'provider' in w);

  if (!wallet) {
    return <div>No compatible wallet found</div>;
  }

  return <WalletView wallet={wallet} />;
};

const WalletView = ({ wallet }: { wallet: Wallet }) => {
  const { connect } = useWallet();
  const isWalletReady =
    wallet.readyState === WalletReadyState.Installed ||
    wallet.readyState === WalletReadyState.Loadable;
  const mobileSupport = wallet.deeplinkProvider;

  const onWalletConnectRequest = async (walletName: WalletName) => {
    try {
      await connect(walletName);
    } catch (error) {
      console.warn(error);
      window.alert("Failed to connect wallet");
    }
  };

  /**
   * If we are on a mobile browser, adapter checks whether a wallet has a `deeplinkProvider` property
   * a. If it does, on connect it should redirect the user to the app by using the wallet's deeplink url
   * b. If it does not, up to the dapp to choose on the UI, but can simply disable the button
   * c. If we are already in a in-app browser, we don't want to redirect anywhere, so connect should work as expected in the mobile app.
   *
   * !isWalletReady - ignore installed/sdk wallets that don't rely on window injection
   * isRedirectable() - are we on mobile AND not in an in-app browser
   * mobileSupport - does wallet have deeplinkProvider property? i.e does it support a mobile app
   */
  if (!isWalletReady && isRedirectable()) {
    // wallet has mobile app
    if (mobileSupport) {
      return (
        <Button
          disabled={false}
          key={wallet.name}
          onClick={() => onWalletConnectRequest(wallet.name)}
          style={{ maxWidth: "300px" }}
        >
          Connect Wallet
        </Button>
      );
    }
    // wallet does not have mobile app
    return (
      <Button
        disabled={true}
        key={wallet.name}
        style={{ maxWidth: "300px" }}
      >
        Connect Wallet - Desktop Only
      </Button>
    );
  } else {
    // desktop
    return (
      <Button
        className={cn(
          isWalletReady ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"
        )}
        disabled={!isWalletReady}
        key={wallet.name}
        onClick={() => onWalletConnectRequest(wallet.name)}
        style={{ maxWidth: "300px" }}
      >
        Connect Wallet
      </Button>
    );
  }
};
