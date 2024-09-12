'use client';

import {
  Ed25519PublicKey,
  InputGenerateTransactionPayloadData,
} from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { getAptosClient } from '@/lib/aptosClient';
import { MODULE_ADDRESS } from '@/lib/constants';
import { HTTP_STATUS } from '@/lib/constants';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

import { Networks as NetworksChecker } from '@/components/checker/Networks';
import FetchListData from '@/components/landing/containers/FetchListData';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { WalletAdapterButton } from '@/components/wallet-adapter/WalletAdapterButton';
import { WalletAdapterModelDialog } from '@/components/wallet-adapter/WalletAdapterModelDialog';

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

interface DataTableProps<TData, TValue> {
  fetchStatus: string | null;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  hasTodoList: boolean;
  updateHasTodoList?: (hasTodoList: boolean) => void
}

export function DataTable<TData, TValue>({
  fetchStatus,
  data,
  columns,
  hasTodoList,
  updateHasTodoList,
}: DataTableProps<TData, TValue>) {
  const isMounted = useIsMounted();
  const { connected, isLoading } = useWallet();

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    // https://stackoverflow.com/questions/70752474/react-table-removes-filters-when-updating-data
    autoResetAll: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const isFetching = useMemo(
    () => fetchStatus === HTTP_STATUS.LOADING,
    [fetchStatus],
  );

  const { account, signAndSubmitTransaction } = useWallet();

  const client = getAptosClient();

  const createList = async () => {
    try {
      if (!account) {
        return;
      }
      // build transaction
      const payload: InputGenerateTransactionPayloadData = {
        function: `${MODULE_ADDRESS}::todolist::create_list`,
        functionArguments: [],
      };
      const rawTxn = await client.transaction.build.simple({
        sender: account.address,
        data: payload,
      });

      const publicKey = new Ed25519PublicKey(account.publicKey.toString());
      const userTransaction = await client.transaction.simulate.simple({
        signerPublicKey: publicKey,
        transaction: rawTxn,
        options: {
          estimateGasUnitPrice: true,
          estimateMaxGasAmount: true,
          estimatePrioritizedGasUnitPrice: true,
        },
      });

      const pendingTxn = await signAndSubmitTransaction({
        data: payload,
        options: {
          maxGasAmount: parseInt(
            String(Number(userTransaction[0].gas_used) * 1.2),
          ),
          gasUnitPrice: Number(userTransaction[0].gas_unit_price),
        },
      });

      const response = await client.waitForTransaction({
        transactionHash: pendingTxn.hash,
      });
      if (response && response?.success) {
        console.log({ hash: pendingTxn?.hash, result: response });
        updateHasTodoList && updateHasTodoList(true);
      } else {
        console.log({ message: response.vm_status || 'Transaction error!' });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const renderSkeletonRow = useMemo(
    () => (
      <TableRow key='skeleton-row-key'>
        {columns.map((column) => (
          <TableCell key={column.id} className='h-24 text-center'>
            {'accessorKey' in column && column.accessorKey === 'id' && (
              <Skeleton className='h-4 w-[50px]' />
            )}
            {'accessorKey' in column && column.accessorKey === 'title' && (
              <Skeleton className='h-4 w-[150px]' />
            )}
            {'accessorKey' in column && column.accessorKey === 'status' && (
              <Skeleton className='h-4 w-[100px]' />
            )}
            {column.id === 'actions' && <Skeleton className='h-4 w-[50px]' />}
          </TableCell>
        ))}
      </TableRow>
    ),
    [columns],
  );

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/** Case 1: Not mounted, render skeleton */}
            {!isMounted && renderSkeletonRow}

            {/** Case 2: Mounted, not connected, not loading */}
            {isMounted && !connected && !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No connected wallet.
                  <br />
                  <WalletAdapterModelDialog>
                    <DialogTrigger asChild>
                      <WalletAdapterButton icon />
                    </DialogTrigger>
                  </WalletAdapterModelDialog>
                </TableCell>
              </TableRow>
            )}

            {/** Case 3: Mounted, fetching data or wallet is loading */}
            {isMounted &&
              ((connected && isFetching) || isLoading) &&
              renderSkeletonRow}

            {/** Case 4: Mounted, connected, and has data */}
            {isMounted &&
              connected &&
              !isFetching &&
              (hasTodoList ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                    <br />
                    <NetworksChecker>
                      <Button onClick={createList}>Create your list</Button>
                    </NetworksChecker>
                  </TableCell>
                </TableRow>
              ))}

            {/** Case 5: Mounted, connected, fetch data */}
            {isMounted && connected && (
              <>
                <FetchListData />
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
