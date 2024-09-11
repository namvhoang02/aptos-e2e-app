import { Network } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React, { useState } from 'react';

import { AptosCircle } from '@/components/icons/network/circle/AptosCircle';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent } from '@/components/ui/popover';

import { chainName, CHAINS } from '@/config';
import { useToast } from '@/components/ui/use-toast';
// import { Loader2 } from 'lucide-react';

export function NetworkSelector({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(false); // Loading state
  const { network, changeNetwork } = useWallet();

  const handleNetworkSwitch = async (chainId: Network) => {
    // setIsLoading(true);
    if (chainId === network?.name) {
      return;
    }
    try {
      await changeNetwork(chainId);
      toast({
        title: 'Success',
        description: `Switched to ${chainName[chainId]}`,
      });
    } catch (error) {
      console.error('Error switching network:', error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to switch network',
        variant: 'destructive',
      });
    }
    // finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      {children}
      <PopoverContent className='w-60 p-0'>
        <Command>
          <CommandInput placeholder='Type a command or search...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Networks'>
              {CHAINS.map((chain: Network) => (
                <CommandItem
                  key={chain}
                  value={chain}
                  onSelect={() => {
                    handleNetworkSwitch(chain);
                    // setOpen(false);
                  }}
                  className='cursor-pointer'
                >
                  <AptosCircle className='mr-2 h-4 w-4' />
                  {chainName[chain] ?? 'Unknown network'}
                  {/* {isLoading && <Loader2 className='ml-2 h-4 w-4 animate-spin' />} */}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
