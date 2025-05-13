import axios from 'axios';
import { ENDPOINTS } from '@/constants/api';
import type { GroceryItem } from '@/types/grocery-types';

export interface AddGroceryItemDto {
  name: string;
  amount: number;
}

export interface UpdateGroceryItemDto {
  name?: string;
  amount?: number;
  isBought?: boolean;
}

export const groceryApi = {
  getAll: (): Promise<GroceryItem[]> =>
    axios.get<GroceryItem[]>(ENDPOINTS.GROCERIES).then((res) => res.data),

  add: (item: AddGroceryItemDto): Promise<GroceryItem> =>
    axios
      .post<GroceryItem>(ENDPOINTS.GROCERIES, {
        ...item,
        isBought: false,
      })
      .then((res) => res.data),

  update: (id: string, updates: UpdateGroceryItemDto): Promise<GroceryItem> =>
    axios
      .patch<GroceryItem>(`${ENDPOINTS.GROCERIES}/${id}`, updates)
      .then((res) => res.data),

  delete: (id: string): Promise<void> =>
    axios.delete(`${ENDPOINTS.GROCERIES}/${id}`).then(() => undefined),

  toggleBought: (item: GroceryItem): Promise<GroceryItem> =>
    axios
      .patch<GroceryItem>(`${ENDPOINTS.GROCERIES}/${item.id}`, {
        isBought: !item.isBought,
      })
      .then((res) => res.data),

  addBulk: (items: AddGroceryItemDto[]): Promise<GroceryItem[]> =>
    Promise.all(
      items.map((item) =>
        axios
          .post<GroceryItem>(ENDPOINTS.GROCERIES, {
            ...item,
            isBought: false,
          })
          .then((res) => res.data)
      )
    ),

  deleteAll: (items: GroceryItem[]): Promise<void[]> =>
    Promise.all(
      items.map((item) =>
        axios.delete(`${ENDPOINTS.GROCERIES}/${item.id}`).then(() => undefined)
      )
    ),

  markAll: (items: GroceryItem[], isBought: boolean): Promise<GroceryItem[]> =>
    Promise.all(
      items.map((item) =>
        axios
          .patch<GroceryItem>(`${ENDPOINTS.GROCERIES}/${item.id}`, {
            isBought,
          })
          .then((res) => res.data)
      )
    ),
};
