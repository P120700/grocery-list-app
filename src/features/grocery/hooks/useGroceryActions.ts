import { useMutation, useQueryClient } from '@tanstack/react-query';
import { groceryApi } from '@/services/api';
import { sampleItems } from '@/constants/sample-items';
import type { GroceryItem } from '@/types/grocery-types';
import { QUERY_KEYS } from './useGroceryList';
import type { GroceryFormValues } from '../components/GroceryForm';

export function useGroceryActions() {
  const queryClient = useQueryClient();

  const invalidateGroceries = (): Promise<void> =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROCERIES });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<GroceryItem>;
    }) => groceryApi.update(id, updates),
    onSuccess: invalidateGroceries,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => groceryApi.delete(id),
    onSuccess: invalidateGroceries,
  });

  const toggleBoughtMutation = useMutation({
    mutationFn: (item: GroceryItem) => groceryApi.toggleBought(item),
    onSuccess: invalidateGroceries,
  });

  const bulkToggleMutation = useMutation({
    mutationFn: async ({
      items,
      isBought,
    }: {
      items: GroceryItem[];
      isBought: boolean;
    }) => {
      try {
        return groceryApi.markAll(items, isBought);
      } catch (error: unknown) {
        console.error(
          'Failed to toggle all items:',
          error instanceof Error ? error.message : error
        );
        throw error;
      }
    },
    onSuccess: invalidateGroceries,
  });

  const addItem = useMutation({
    mutationFn: (item: GroceryFormValues) => groceryApi.add(item),
    onSuccess: invalidateGroceries,
  });

  const bulkAddMutation = useMutation({
    mutationFn: async () => {
      try {
        const randomItems = Array.from({ length: 10 }, () => {
          const random =
            sampleItems[Math.floor(Math.random() * sampleItems.length)];
          return { ...random };
        });
        return groceryApi.addBulk(randomItems);
      } catch (error: unknown) {
        console.error(
          'Failed to add bulk items:',
          error instanceof Error ? error.message : error
        );
        throw error;
      }
    },
    onSuccess: invalidateGroceries,
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async () => {
      try {
        const items = await groceryApi.getAll();
        return groceryApi.deleteAll(items);
      } catch (error: unknown) {
        console.error(
          'Failed to delete all items:',
          error instanceof Error ? error.message : error
        );
        throw error;
      }
    },
    onSuccess: invalidateGroceries,
  });

  return {
    updateMutation,
    deleteMutation,
    toggleBoughtMutation,
    bulkToggleMutation,
    addItem,
    bulkAddMutation,
    bulkDeleteMutation,
  };
}
