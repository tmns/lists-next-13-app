import type { Note, List, Item } from "@prisma/client";
import { cache } from "react";
import { prisma } from "server/db";

export const getLists = cache(async (userId: string): Promise<List[]> => {
  return await prisma.list.findMany({ where: { userId } });
});

export const getItems = cache(async (listId: string): Promise<Item[]> => {
  return await prisma.item.findMany({ where: { listId } });
});

export const getNote = cache(async (userId: string): Promise<Note | null> => {
  return await prisma.note.findFirst({ where: { userId } });
});
