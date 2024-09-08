// FIXME: add className???

import { truncateAddress, useWallet } from '@aptos-labs/wallet-adapter-react';
import { Loader2 } from 'lucide-react';
import React from 'react';

import { useIsMounted } from '@/lib/hooks/useIsMounted';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type ButtonProps, Button } from '@/components/ui/button';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { WalletAdapterButton } from '../wallet-adapter/WalletAdapterButton';
import { WalletAdapterModelDialog } from '../wallet-adapter/WalletAdapterModelDialog';

export function UserProfileButton({
  size = 'default',
  ...props
}: ButtonProps): JSX.Element {
  const isMounted = useIsMounted();
  const { connected, account, wallet } = useWallet();

  // Loading state when not mounted
  if (!isMounted) {
    return (
      <Button
        variant='secondary'
        className='rounded-xl'
        size={size}
        disabled
        {...props}
      >
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        Loading...
      </Button>
    );
  }

  // Show connect button if not connected
  if (!connected) {
    return (
      <WalletAdapterModelDialog>
        <WalletAdapterButton size={size} {...props} />
      </WalletAdapterModelDialog>
    );
  }

  // Display user profile button when connected
  return (
    <DropdownMenuTrigger asChild>
      <Button variant='secondary' className='rounded-xl' size={size} {...props}>
        <Avatar className='mr-2 h-6 w-6'>
          <AvatarImage alt={wallet?.name} src={wallet?.icon} />
          <AvatarFallback>{wallet?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        {account?.ansName
          ? account.ansName
          : truncateAddress(account?.address ?? 'Unknown')}
      </Button>
    </DropdownMenuTrigger>
  );
}
