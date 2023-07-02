"use client";
import List from "./List";
import { useListsContext } from "./ListsProvider";
import type { deleteList, updateList } from "./_actions";

type ListsProps = {
  deleteList: typeof deleteList;
  updateList: typeof updateList;
};

export default function Lists({ deleteList, updateList }: ListsProps) {
  const { lists } = useListsContext();

  return lists.map((list) => (
    <List key={list.id} lists={lists} list={list} deleteList={deleteList} updateList={updateList} />
  ));
}
