"use client"
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
} from "@tanstack/react-table"
import React, { useEffect,useState } from "react";

import { getAptosClient } from "@/lib/aptosClient";
import { MODULE_ADDRESS } from "@/lib/constants";

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

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

type Task = {
  address: string;
  completed: boolean;
  content: string;
  task_id: string;
};

function convertTask(task: Task) {
  return {
    id: task.task_id,
    title: task.content,
    status: task.completed ? 'done' : 'backlog',
  }
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const { connected } = useWallet();

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );

  const [sorting, setSorting] = useState<SortingState>([])

  const { account } = useWallet();

  const [tasks, setTasks] = useState<any>([]);

  const client = getAptosClient();

  const fetchData = async () => {
    try {
      if (!account) {
        return;
      }

      const todoListResource = await client.getAccountResource({
        accountAddress: account.address,
        resourceType: `${MODULE_ADDRESS}::todolist::TodoList`
      });

      // tasks table handle
      const tableHandle = (todoListResource as any).tasks.handle;
      // tasks table counter
      const taskCounter = (todoListResource as any).task_counter;

      const tasks: Task[] = [];
      let counter = 1;
      while (counter <= taskCounter) {
        const tableItem = {
          key_type: "u64",
          value_type: `${MODULE_ADDRESS}::todolist::Task`,
          key: `${counter}`,
        };
        const task = await client.getTableItem<Task>({ handle: tableHandle, data: tableItem });
        tasks.push(task);
        counter++;
      }
      setTasks(tasks.map(convertTask));
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const table = useReactTable({
    data: tasks,
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

  useEffect(() => {
    fetchData();
  }, [account, fetchData]);

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {connected && (table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
                  No results.
                  <Button>Create your list</Button>
                </TableCell>
              </TableRow>
            ))}
            {!connected && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                  <WalletButtons />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
