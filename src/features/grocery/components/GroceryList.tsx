import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useCallback, useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGroceryActions } from '../hooks/useGroceryActions';
import { useGroceryList } from '../hooks/useGroceryList';
import type { GroceryItem } from '@/types/grocery-types';

interface GroceryListProps {
  onEditSelect: (item: GroceryItem | null) => void;
}

function getColumns({
  onEdit,
  onDelete,
  onCheckbox,
  onMarkAll,
}: {
  onEdit: (item: GroceryItem) => void;
  onDelete: (id: string) => void;
  onCheckbox: (item: GroceryItem) => void;
  onMarkAll: (isBought: boolean) => void;
}): ColumnDef<GroceryItem>[] {
  return [
    {
      id: 'isBought',
      header: ({ table }) => {
        const allRows = table.getRowModel().rows;
        const allChecked = allRows.every((row) => row.original.isBought);
        const someChecked =
          !allChecked && allRows.some((row) => row.original.isBought);

        return (
          <Checkbox
            checked={allChecked ? true : someChecked ? 'indeterminate' : false}
            onCheckedChange={(value) => onMarkAll(!!value)}
            aria-label="Mark all as bought"
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.isBought}
          onCheckedChange={() => onCheckbox(row.original)}
          aria-label="Mark row as bought"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isMarked = row.original.isBought;
        return (
          <div className={`lowercase ${isMarked ? 'line-through' : ''}`}>
            {row.getValue('name')}
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount: number = row.original.amount;
        return <div className="text-right font-medium">{amount}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item.id)}
                className="text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export function GroceryList({ onEditSelect }: GroceryListProps) {
  const { deleteMutation, toggleBoughtMutation, bulkToggleMutation } =
    useGroceryActions();
  const { groceries } = useGroceryList();

  const handlePressCheckbox = useCallback(
    (item: GroceryItem) => {
      toggleBoughtMutation.mutate(item);
    },
    [toggleBoughtMutation]
  );

  const handleDelete = useCallback(
    (id: string) => deleteMutation.mutate(id),
    [deleteMutation]
  );
  const handleEdit = useCallback(
    (item: GroceryItem) => {
      onEditSelect(item || null);
    },
    [onEditSelect]
  );
  const handleMarkAll = useCallback(
    (isBought: boolean) => {
      const visibleRows = table.getRowModel().rows;
      const visibleItems = visibleRows.map((row) => row.original);
      if (visibleItems.length > 0) {
        bulkToggleMutation.mutate({ items: visibleItems, isBought });
      }
    },
    [bulkToggleMutation]
  );

  const columns = useMemo(() => {
    return getColumns({
      onEdit: handleEdit,
      onDelete: handleDelete,
      onCheckbox: handlePressCheckbox,
      onMarkAll: handleMarkAll,
    });
  }, [handleEdit, handleDelete, handlePressCheckbox, handleMarkAll]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: groceries || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  return (
    <div className="p-4">
      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-gray-500 mr-2">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
