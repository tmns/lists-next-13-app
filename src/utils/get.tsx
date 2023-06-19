import { cache } from "react";
import { prisma } from "server/db";

type List = { id: string; name: string };
type Item = { id: string; title: string; listId: string; isChecked: boolean };

export const getLists = cache(async (userId: string): Promise<List[]> => {
  return await prisma.list.findMany({ where: { userId } });
});

export const getItems = cache(async (listId: string): Promise<Item[]> => {
  return await prisma.item.findMany({ where: { listId } });
});
