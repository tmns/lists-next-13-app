"use client";
import Item from "./Item";
import { useItemsContext } from "./ItemsProvider";
import type { deleteItem, updateItem } from "./_actions";

type ItemsProps = {
  updateItem: typeof updateItem;
  deleteItem: typeof deleteItem;
};

export default function Items({ updateItem, deleteItem }: ItemsProps) {
  const { items } = useItemsContext();

  return items.map((item) => {
    return (
      <Item
        item={item}
        items={items}
        key={item.id}
        updateItem={updateItem}
        deleteItem={deleteItem}
      />
    );
  });
}
