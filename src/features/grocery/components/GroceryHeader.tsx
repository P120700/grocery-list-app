import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGroceryActions } from '../hooks/useGroceryActions';
import { UserAvatar } from '@/components/UserAvatar';

export function GroceryHeader() {
  const { bulkAddMutation, bulkDeleteMutation } = useGroceryActions();
  const isAddingBulk = bulkAddMutation.isPending;
  const isDeletingBulk = bulkDeleteMutation.isPending;

  const handleBulkAdd = () => {
    bulkAddMutation.mutate();
  };

  const handleBulkDelete = () => {
    bulkDeleteMutation.mutate();
  };

  return (
    <div className="justify-between flex items-center px-4 py-3 bg-white border-b">
      <h1 className="text-xl font-bold">Grocery List</h1>
      <div className="justify-between flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            disabled={isAddingBulk || isDeletingBulk}
          >
            <UserAvatar />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleBulkAdd} disabled={isAddingBulk}>
              {isAddingBulk ? 'Adding items...' : 'Add 10 random items'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleBulkDelete}
              disabled={isDeletingBulk}
              className="text-red-500"
            >
              {isDeletingBulk ? 'Deleting items...' : 'Delete all items'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
