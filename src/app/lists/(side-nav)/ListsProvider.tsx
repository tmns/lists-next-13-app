"use client";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";
import type { List } from "./List";

const ListsContext = createContext(
  {} as {
    lists: List[];
    setLists: Dispatch<SetStateAction<List[]>>;
  }
);

interface ProviderProps {
  lists: List[];
  children: JSX.Element[];
}

export const useListsContext = () => useContext(ListsContext);

export default function ListsProvider({ lists: listsFromProps, children }: ProviderProps) {
  const [lists, setLists] = useState(listsFromProps);

  const value = { lists, setLists };
  return <ListsContext.Provider value={value}>{children}</ListsContext.Provider>;
}
