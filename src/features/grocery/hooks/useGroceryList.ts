import { useQuery } from '@tanstack/react-query';
import { groceryApi } from '@/services/api';
import type { GroceryItem } from '@/types/grocery-types';
import { AxiosError } from 'axios';

export const QUERY_KEYS = {
  GROCERIES: ['groceries'] as const,
};

export function useGroceryList() {
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<
    GroceryItem[],
    AxiosError
  >({
    queryKey: QUERY_KEYS.GROCERIES,
    queryFn: () => groceryApi.getAll(),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
  });

  return {
    groceries: data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    isEmpty: data?.length === 0,
  };
}
