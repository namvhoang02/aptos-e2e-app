import { WalletName, useWallet } from '@aptos-labs/wallet-adapter-react';
import React from 'react';
// import { WalletIcons } from './connect-view/connect-view'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

export function ConnectButton(props: ButtonProps) {
  const { wallets, connect } = useWallet();

  const onSelect = (name: WalletName) => {
    connect(name);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...props}>
          <span className='hidden sm:block'>Connect Wallet</span>
          <span className='block sm:hidden'>Connect</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuGroup>
          {wallets?.map((wallet) => {
            return (
              <DropdownMenuItem
                onClick={() => onSelect(wallet.name)}
                key={wallet.name}
              >
                <Avatar className='mr-2 h-4 w-4'>
                  <AvatarImage alt={wallet?.name} src={wallet?.icon} />
                  <AvatarFallback>{wallet?.name}</AvatarFallback>
                </Avatar>
                {wallet.name}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
