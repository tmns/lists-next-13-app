"use client";
import { useGetItems } from "utils/queries/items";
import Item from "./Item";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

type ItemsProps = {
  listId: string;
  headers: ReadonlyHeaders;
};

export default function Items({ listId, headers }: ItemsProps) {
  const [items] = useGetItems(listId, headers);

  return items?.map((item) => {
    return <Item item={item} items={items} key={item.id} listId={listId} />;
  });
}
