"use client";
import type { List } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

export type ProviderList = Pick<List, "name" | "id"> & {
  userId?: string;
  isLoading?: boolean;
};

const ListsContext = createContext(
  {} as {
    lists: ProviderList[];
    setLists: Dispatch<SetStateAction<ProviderList[]>>;
  }
);

interface ProviderProps {
  lists: ProviderList[];
  children: JSX.Element[];
}

export const useListsContext = () => useContext(ListsContext);

export default function ListsProvider({ lists: listsFromProps, children }: ProviderProps) {
  const [lists, setLists] = useState(listsFromProps);

  const value = { lists, setLists };
  return <ListsContext.Provider value={value}>{children}</ListsContext.Provider>;
}
