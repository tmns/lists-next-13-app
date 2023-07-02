import { nanoid } from "nanoid";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "server/auth";
import { getNote } from "utils/get";
import Editor from "./Editor";
import { prisma } from "server/db";

export default async function Notes() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  let note = await getNote(session.user.id);

  if (!note) {
    note = await prisma.note.create({
      data: {
        instanceId: nanoid(),
        content: JSON.stringify({ type: "doc", content: [] }),
        userId: session.user.id,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  return <Editor note={note} />;
}
