'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Copy, ExternalLink, LogOut } from 'lucide-react';
import React from 'react';

import { ClipboardController } from '@/components/ui/clipboard-controller';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { IconButton } from '@/components/ui/iconbutton';
// import { LinkExternal } from '@/components/ui/link';
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
  const { account, disconnect } = useWallet();

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
          <DropdownMenuItem className='cursor-pointer'>
            <ExternalLink className='mr-2 h-4 w-4' />
            View on Explorer
            {/* 
            <LinkExternal
              href={chains[chainId as ChainId].getAccountUrl(address!)}
            >
              <IconButton
                size="xs"
                icon={ExternalLink}
                description="View on Explorer"
                name="View on Explorer"
              />
            </LinkExternal> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem className='cursor-pointer' onClick={disconnect}>
          <LogOut className='mr-2 h-4 w-4' />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
