'use client';

import {
  useWallet,
} from '@aptos-labs/wallet-adapter-react';
import { Copy, ExternalLink,LogOut } from 'lucide-react';
import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function UserProfileWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { disconnect } = useWallet();

  return (
    <DropdownMenu>
      {children}
      <DropdownMenuContent className='w-80 max-w-sm' align='end' side='bottom'>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>shadcn</p>
            <p className='text-xs leading-none text-muted-foreground'>
              m@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Copy className='mr-2 h-4 w-4' />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ExternalLink className='mr-2 h-4 w-4' />
            View on Explorer
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={disconnect}>
          <LogOut className='mr-2 h-4 w-4' />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
