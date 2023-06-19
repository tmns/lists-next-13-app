"use server";
import { action } from "lib/safe-action";
import { revalidatePath } from "next/cache";
import { prisma } from "server/db";
import { z } from "zod";

const createItemInput = z.object({ title: z.string(), listId: z.string() });
export const createItem = action(
  { input: createItemInput, withAuth: true },
  async ({ listId, title }, session) => {
    // Ensure that the requested list to edit belongs to the user making the request.
    // Is there a better way to do this?
    const list = await prisma.list.findFirst({ where: { id: listId } });
    const belongsToUser = list?.userId === session.user.id;
    if (!belongsToUser) {
      throw new Error("You are not authorized to access that data.");
    }

    const newItem = await prisma.item.create({
      data: {
        listId,
        title,
      },
    });

    revalidatePath(`/lists/${listId}`);

    return newItem;
  }
);

const updateItemInput = z.object({
  id: z.string(),
  title: z.string().optional(),
  isChecked: z.boolean().optional(),
});
export const updateItem = action(
  { input: updateItemInput, withAuth: true },
  async ({ id, title, isChecked }, session) => {
    // Ensure that the requested item to edit belongs to the user making the request.
    // Is there a better way to do this?
    const item = await prisma.item.findFirst({ where: { id } });
    const list = await prisma.list.findFirst({
      where: { id: item?.listId },
    });
    const belongsToUser = list?.userId === session.user.id;
    if (!belongsToUser) {
      throw new Error("You are not authorized to access that data.");
    }

    const updatedItem = await prisma.item.update({
      data: { title, isChecked },
      where: { id },
    });

    revalidatePath(`/lists/${list.id}`);

    return updatedItem;
  }
);

const deleteItemInput = z.object({ id: z.string() });
export const deleteItem = action(
  { input: deleteItemInput, withAuth: true },
  async ({ id }, session) => {
    // Ensure that the requested item to edit belongs to the user making the request.
    // Is there a better way to do this?
    const item = await prisma.item.findFirst({ where: { id } });
    const list = await prisma.list.findFirst({
      where: { id: item?.listId },
    });
    const belongsToUser = list?.userId === session.user.id;
    if (!belongsToUser) {
      throw new Error("You are not authorized to access that data.");
    }

    const deletedItem = await prisma.item.delete({ where: { id } });

    revalidatePath(`/lists/${list.id}`);

    return deletedItem;
  }
);
