"use server";
import type { Note } from "@prisma/client";
import { action } from "lib/safe-action";
import { revalidatePath } from "next/cache";
import { prisma } from "server/db";
import { z } from "zod";

const updateNodeInput = z.object({
  id: z.string(),
  instanceId: z.string(),
  content: z.string(),
});

export const updateNote = action(
  { input: updateNodeInput, withAuth: true },
  async ({ id, instanceId, content }, session) => {
    // Ensure that the requested note to edit belongs to the user making the request
    const note = await prisma.note.findFirst({ where: { id } });

    const belongsToUser = note?.userId === session.user.id;
    if (!belongsToUser) {
      throw new Error("You are not authorized to access that data.");
    }

    const updatedNote: Note = await prisma.note.update({
      data: { content, instanceId, updatedAt: new Date().toISOString() },
      where: { id },
    });

    console.log("broadcasting update for note", id, "from instance", instanceId);
    const bc = new BroadcastChannel(`notes/${note.userId}`);
    bc.postMessage({ note: updatedNote });
    setTimeout(() => bc.close(), 5);

    revalidatePath("/notes");

    return updatedNote;
  }
);
