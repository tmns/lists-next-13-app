"use client";
import type { Item } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

export type ProviderItem = Item & { isLoading?: boolean };

const ItemsContext = createContext(
  {} as {
    items: ProviderItem[];
    setItems: Dispatch<SetStateAction<ProviderItem[]>>;
  }
);

interface ProviderProps {
  items: ProviderItem[];
  children: JSX.Element[];
}

export const useItemsContext = () => useContext(ItemsContext);

export default function ItemsProvider({ items: itemsFromProps, children }: ProviderProps) {
  const [items, setItems] = useState(itemsFromProps);

  const value = { items, setItems };
  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}
