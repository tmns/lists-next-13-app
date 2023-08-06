"use client";
import { useGetLists } from "utils/queries/lists";
import List from "./List";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

type ListsProps = {
  headers: ReadonlyHeaders;
};

export default function Lists({ headers }: ListsProps) {
  const [lists] = useGetLists(headers);

  return lists?.map((list) => <List key={list.id} lists={lists} list={list} />);
}
