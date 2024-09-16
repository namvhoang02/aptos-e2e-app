'use client';

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
import { Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';

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

import { AddNewListModal } from './AddNewListModal';
import { AddNewTaskModal } from './AddNewTaskModal';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

interface DataTableProps<TData, TValue> {
  fetchStatus: string | null;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  hasTodoList: boolean;
}

export function DataTable<TData, TValue>({
  fetchStatus,
  data,
  columns,
  hasTodoList,
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

  // Renders skeleton row while data is being fetched or components are mounting
  const renderSkeletonRow = () => (
    <TableRow key='skeleton-row-key'>
      {columns.map((column, index: number) => (
        <TableCell key={`skeleton-row-key-${index}`} className='text-center'>
          {'accessorKey' in column && column.accessorKey === 'id' && (
            <div className='min-h-[300px] text-center flex flex-col items-center justify-center'>
              <Skeleton className='h-4 w-[50px]' />
            </div>
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
  );

  // Renders the message when no wallet is connected
  const renderNoWalletConnected = () => (
    <TableRow>
      <TableCell colSpan={columns.length}>
        <div className='min-h-[300px] text-center flex flex-col items-center justify-center'>
          <p className='text-lg font-semibold'>Wallet not connected</p>
          <p className='text-sm text-muted-foreground'>
            Please connect your wallet to proceed.
          </p>
          <WalletAdapterModelDialog>
            <DialogTrigger asChild>
              <WalletAdapterButton icon className='mt-2' />
            </DialogTrigger>
          </WalletAdapterModelDialog>
        </div>
      </TableCell>
    </TableRow>
  );

  // Renders the message when there is no data
  const renderNoData = () => (
    <TableRow>
      <TableCell colSpan={columns.length}>
        <div className='min-h-[300px] text-center flex flex-col items-center justify-center'>
          <p className='text-lg font-semibold'>No data found</p>
          <p className='text-sm text-muted-foreground'>
            It looks like there's nothing here yet.
          </p>

          <AddNewTaskModal>
            <DialogTrigger asChild>
              <Button className='mt-2'>
                <Plus className='mr-2 h-4 w-4' /> Create new task
              </Button>
            </DialogTrigger>
          </AddNewTaskModal>
        </div>
      </TableCell>
    </TableRow>
  );

  // Renders prompt to create a to-do list when none exists
  const renderCreateListPrompt = () => (
    <TableRow>
      <TableCell colSpan={columns.length}>
        <div className='min-h-[300px] text-center flex flex-col items-center justify-center'>
          <p className='text-lg font-semibold'>No list available</p>
          <p className='text-sm text-muted-foreground'>
            Create a new list to get started.
          </p>
          <NetworksChecker>
            <AddNewListModal>
              <DialogTrigger asChild>
                <Button className='mt-2'>Create your list</Button>
              </DialogTrigger>
            </AddNewListModal>
          </NetworksChecker>
        </div>
      </TableCell>
    </TableRow>
  );

  // Main table content renderer with conditional display logic
  const renderTableContent = () => {
    if (!isMounted) return renderSkeletonRow();
    if (!connected && !isLoading) return renderNoWalletConnected();
    if (connected && (isFetching || isLoading)) return renderSkeletonRow();
    if (connected && hasTodoList) {
      return table.getRowModel().rows.length > 0
        ? table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        : renderNoData();
    } else {
      return renderCreateListPrompt();
    }
  };

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
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      {isMounted && connected && <FetchListData />}
    </div>
  );
}
