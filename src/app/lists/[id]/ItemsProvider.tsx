"use client";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { Item } from "./Item";

const ItemsContext = createContext(
  {} as {
    items: Item[];
    setItems: Dispatch<SetStateAction<Item[]>>;
  }
);

interface ProviderProps {
  items: Item[];
  children: JSX.Element[];
}

export const useItemsContext = () => useContext(ItemsContext);

export default function ItemsProvider({ items: itemsFromProps, children }: ProviderProps) {
  const [items, setItems] = useState(itemsFromProps);

  const value = { items, setItems };
  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}
