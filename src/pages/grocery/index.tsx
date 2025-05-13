import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { GroceryItem } from '@/types/grocery-types';
import {
  GroceryHeader,
  AddGroceryItem,
  GroceryList,
  GroceryEditModal,
  useGroceryList,
} from '@/features/grocery';

export default function GroceryScreen() {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const { isLoading, isError, refetch, isEmpty } = useGroceryList();

  const handleEditSelect = (item: GroceryItem | null) => {
    setEditingItem(item);
    setOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <GroceryHeader />
      <AddGroceryItem />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : isError ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-red-500 mb-4">Failed to load grocery items</div>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      ) : isEmpty ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 px-4">
          Your grocery list is empty. Add some items above!
        </div>
      ) : (
        <GroceryList onEditSelect={handleEditSelect} />
      )}

      <GroceryEditModal
        editingItem={editingItem}
        isOpen={open}
        onIsOpenChange={setOpen}
      />
    </div>
  );
}
