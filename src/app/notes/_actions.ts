"use server";
import type { Note } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";

type UpdatedNote = {
  id: string;
  instanceId: string;
  content: string;
};

export async function updateNote({ id, instanceId, content }: UpdatedNote) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Not logged in", { status: 401 });
  }

  const note = await prisma.note.findFirst({ where: { id, userId: session.user.id } });

  if (!note) {
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
