import { useGroceryActions } from '../hooks/useGroceryActions';
import { GroceryForm, type GroceryFormValues } from './GroceryForm';

export function AddGroceryItem() {
  const { addItem } = useGroceryActions();
  const isLoading = addItem.isPending;

  const handleSubmit = (data: GroceryFormValues) => {
    addItem.mutate({ ...data });
  };

  return (
    <div className="px-4 py-4 bg-gray-50">
      <GroceryForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Add"
        loadingLabel="Adding..."
        isCompact
      />
    </div>
  );
}
