'use client';

import { truncateAddress } from '@aptos-labs/wallet-adapter-react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Copy, ExternalLink, LogOut } from 'lucide-react';
import React from 'react';

import { getAccountUrl } from '@/lib/chain';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClipboardController } from '@/components/ui/clipboard-controller';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { IconButton } from '@/components/ui/iconbutton';
import { LinkExternal } from '@/components/ui/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function UserProfileWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { account, disconnect, wallet, network } = useWallet();

  return (
    <DropdownMenu>
      {children}
      <DropdownMenuContent className='w-80 max-w-sm' align='end' side='bottom'>
        <DropdownMenuLabel className='font-normal'>
          <div className='inline-flex items-center justify-center'>
            <Avatar className='mr-2 h-6 w-6'>
              <AvatarImage alt={wallet?.name} src={wallet?.icon} />
              <AvatarFallback>{wallet?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {account?.ansName
              ? account.ansName
              : truncateAddress(account?.address ?? 'Unknown')}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ClipboardController hideTooltip>
          {({ setCopied, isCopied }) => (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={(evt) => {
                      evt.preventDefault();
                      account?.address && setCopied(account.address);
                    }}
                  >
                    <IconButton
                      variant='ghost'
                      className='mr-2'
                      size='xs'
                      icon={Copy}
                      name='Copy'
                    />
                    Copy Address
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>{isCopied ? 'Copied!' : 'Copy Address'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </ClipboardController>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem className='cursor-pointer'>
                <LinkExternal
                  href={
                    account?.address &&
                    getAccountUrl(account.address, network?.name)
                  }
                >
                  <IconButton
                    variant='ghost'
                    className='mr-2'
                    size='xs'
                    icon={ExternalLink}
                    name='View on Explorer'
                  />
                  View on Explorer
                </LinkExternal>
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent side='bottom'>View on Explorer</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem className='cursor-pointer' onClick={disconnect}>
                <IconButton
                  variant='ghost'
                  className='mr-2'
                  size='xs'
                  icon={LogOut}
                  name='View on Explorer'
                />
                Disconnect
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent side='bottom'>Disconnect</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
