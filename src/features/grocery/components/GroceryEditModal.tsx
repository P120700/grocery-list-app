import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGroceryActions } from '../hooks/useGroceryActions';
import type { GroceryItem } from '@/types/grocery-types';
import { GroceryForm, type GroceryFormValues } from './GroceryForm';

interface GroceryEditModalProps {
  editingItem: GroceryItem | null;
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
}

export function GroceryEditModal({
  editingItem,
  isOpen,
  onIsOpenChange,
}: GroceryEditModalProps) {
  const { updateMutation } = useGroceryActions();
  const isLoading = updateMutation.isPending;

  const handleSubmit = (data: GroceryFormValues) => {
    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        updates: { ...data },
      });
      onIsOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onIsOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Make changes to your product. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {editingItem && (
          <GroceryForm
            defaultValues={{
              name: editingItem.name,
              amount: editingItem.amount,
            }}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Save changes"
            loadingLabel="Saving..."
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
