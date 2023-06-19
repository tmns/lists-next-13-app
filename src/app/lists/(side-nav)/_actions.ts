"use server";
import { action } from "lib/safe-action";
import { revalidatePath } from "next/cache";
import { prisma } from "server/db";
import { z } from "zod";

const createListInput = z.object({ name: z.string() });
export const createList = action(
  { input: createListInput, withAuth: true },
  async ({ name }, session) => {
    const newList = await prisma.list.create({
      data: {
        name,
        userId: session.user.id,
      },
      select: { id: true, name: true },
    });

    revalidatePath("/lists/[id]");

    return newList;
  }
);

const updateListInput = z.object({ id: z.string(), name: z.string() });
export const updateList = action(
  { input: updateListInput, withAuth: true },
  async ({ id, name }, session) => {
    // Ensure that the requested list to edit belongs to the user making the request.
    // Is there a better way to do this?
    const list = await prisma.list.findFirst({ where: { id } });
    const belongsToUser = list?.userId === session.user.id;
    if (!belongsToUser) {
      throw new Error("You are not authorized to access that data.");
    }

    const updatedList = await prisma.list.update({
      data: { name },
      where: { id },
      select: { id: true, name: true },
    });

    revalidatePath("/lists/[id]");

    return updatedList;
  }
);

const deleteListInput = z.object({ id: z.string() });
export const deleteList = action(
  { input: deleteListInput, withAuth: true },
  async ({ id }, session) => {
    // Ensure that the requested list to delete belongs to the user making the request.
    // Is there a better way to do this?
    const list = await prisma.list.findFirst({ where: { id } });

    const belongsToUser = list?.userId === session.user.id;

    if (!belongsToUser) {
      throw new Error("You are not authorized to access that data.");
    }

    const deletedList = await prisma.list.delete({
      where: { id },
      select: { id: true, name: true },
    });

    revalidatePath("/lists/[id]");

    return deletedList;
  }
);
