'use client';

import { Loader2 } from 'lucide-react';
import {
  WalletName,
  Wallet,
  useWallet,
} from '@aptos-labs/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import React, { useMemo, useCallback, useState } from 'react';
import { RECOMMENDED_WALLETS, SITENAME } from '@/lib/constants';

export function WalletAdapterModelDialog({ children }: { children: React.ReactNode }) {
  const { wallets, connect, isLoading } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  // Handle wallet selection and connection
  const onSelect = async (name: WalletName) => {
    try {
      await connect(name);
      console.log(`${name} connected successfully!`);
    } catch (error) {
      console.log(`Failed to connect ${name}`);
    }
  };

  // Filtering installed, recommended, and other wallets
  const { installedWallets, recommendedWallets, othersWallets } =
    useMemo(() => {
      const installed = wallets?.filter(
        (wallet: Wallet) => wallet.readyState === 'Installed',
      );
      const recommended = installed?.filter((wallet: Wallet) =>
        RECOMMENDED_WALLETS.includes(wallet.name),
      );
      const others = wallets
        ?.filter((wallet: Wallet) => !RECOMMENDED_WALLETS.includes(wallet.name))
        ?.filter((wallet: Wallet) => wallet.readyState !== 'Installed');

      return {
        installedWallets: installed?.filter(
          (wallet: Wallet) => !RECOMMENDED_WALLETS.includes(wallet.name),
        ),
        recommendedWallets: recommended,
        othersWallets: others,
      };
    }, [wallets]);

  const onClickWallet = useCallback(
    (wallet: Wallet) => {
      return (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (wallet.readyState === 'Installed') {
          onSelect(wallet.name);
          setSelectedWallet(wallet);
        } else {
          window.open(wallet.url, '_blank');
        }
      };
    },
    [onSelect],
  );

  // Function to render wallet list item
  const renderWalletItem = (wallet: Wallet) => (
    <div
      className='flex items-center gap-4 cursor-pointer transition-colors hover:bg-muted/50 py-4'
      key={wallet.name}
      onClick={onClickWallet(wallet)}
    >
      <Avatar className='hidden h-9 w-9 sm:flex'>
        <AvatarImage alt={wallet.name} src={wallet.icon} />
        <AvatarFallback>{wallet.name}</AvatarFallback>
      </Avatar>
      <div className='grid gap-1'>
        <p className='text-sm font-medium leading-none'>{wallet.name}</p>
        <p className='text-sm text-muted-foreground'>
          {wallet.readyState === 'Installed' ? 'Detected' : 'Not installed'}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Connect a Wallet</DialogTitle>
        </DialogHeader>

        {!isLoading && (
          <div>
            <div className='max-h-[454px] overflow-y-auto'>
              <div className='dark:text-white font-bold text-base mt-5 mb-2'>
                Installed Wallets
              </div>
              {installedWallets?.map(renderWalletItem)}

              <div className='dark:text-white font-bold text-base mt-2 mb-2'>
                Recommended Wallets
              </div>
              {recommendedWallets?.map(renderWalletItem)}

              <div className='dark:text-white font-bold text-base mt-2 mb-2'>
                Other Wallets
              </div>
              {othersWallets?.map(renderWalletItem)}
            </div>

            <DialogFooter className='text-center px-6 py-4'>
              <p className='text-sm text-muted-foreground'>
                By connecting your wallet, you agree to {SITENAME}'{' '}
                <a
                  href='/terms-of-service'
                  target='_blank'
                  rel='noreferrer'
                  className='underline'
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href='/privacy-policy'
                  target='_blank'
                  rel='noreferrer'
                  className='underline'
                >
                  Privacy Policy
                </a>
                .
              </p>
            </DialogFooter>
          </div>
        )}
        {isLoading && selectedWallet && (
          <div className='max-h-[454px] min-h-[396px] overflow-y-auto justify-center items-center flex-1 flex'>
            <div className='flex flex-col gap-2 text-center justify-center items-center'>
              <Avatar className='hidden h-9 w-9 sm:flex'>
                <AvatarImage
                  alt={selectedWallet.name}
                  src={selectedWallet.icon}
                />
                <AvatarFallback>{selectedWallet.name}</AvatarFallback>
              </Avatar>
              <DialogTitle>Opening {selectedWallet.name}...</DialogTitle>
              <DialogDescription>
                Confirm connection in the extension
              </DialogDescription>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
