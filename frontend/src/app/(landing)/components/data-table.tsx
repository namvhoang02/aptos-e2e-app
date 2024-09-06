"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
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
} from "@tanstack/react-table";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WalletButtons } from "@/components/WalletButtons";
import { Skeleton } from "@/components/ui/skeleton";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { HTTP_STATUS } from "@/lib/constants";

interface DataTableProps<TData, TValue> {
  fetchStatus: string | null;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  fetchStatus,
  data,
  columns,
}: DataTableProps<TData, TValue>) {
  const isMounted = useIsMounted();
  const { connected } = useWallet();

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

  const isFetching =
    fetchStatus === HTTP_STATUS.LOADING || fetchStatus === null;

  const renderSkeletonRow = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={column.id} className="h-24 text-center">
          {"accessorKey" in column && column.accessorKey === "id" && (
            <Skeleton className="h-4 w-[50px]" />
          )}
          {"accessorKey" in column && column.accessorKey === "title" && (
            <Skeleton className="h-4 w-[150px]" />
          )}
          {"accessorKey" in column && column.accessorKey === "status" && (
            <Skeleton className="h-4 w-[100px]" />
          )}
          {column.id === "actions" && (
            <Skeleton className="h-4 w-[50px]" />
          )}
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {!header.isPlaceholder &&
                      flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!isMounted && renderSkeletonRow()}
            {isMounted && isFetching && renderSkeletonRow()}
            {isMounted && connected && !isFetching && (
              table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.<br />
                    <Button>Create your list</Button>
                  </TableCell>
                </TableRow>
              )
            )}
            {isMounted && !connected && !isFetching && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.<br />
                  <WalletButtons />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
