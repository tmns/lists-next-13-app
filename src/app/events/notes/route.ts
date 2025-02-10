import type { Note } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getNote } from "utils/get";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Not logged in", { status: 401 });
  }

  let cleanup: () => void;

  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(`retry: 1000\n\n`);
      cleanup = subscribeNotesById(session.user.id, (note) => {
        const data = JSON.stringify(note);
        controller.enqueue(`data: ${data}\n\n`);
      });
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(body.pipeThrough(new TextEncoderStream()), {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}

function subscribeNotesById(userId: string, cb: (note: Note) => void) {
  const bc = new BroadcastChannel(`notes/${userId}`);
  let closed = false;
  getNote(userId)
    .then((note) => {
      if (closed) return;
      cb(note as Note);
      const lastVersionstamps = new Map<string, Date>();
      bc.onmessage = (e) => {
        const { note } = e.data as { note: Note };
        console.log(
          `received update for note ${note.id} from instance ${
            note.instanceId
          } at ${note.updatedAt.toISOString()}`
        );

        if ((lastVersionstamps.get(note.id) ?? 0) >= note.updatedAt) return;
        lastVersionstamps.set(note.id, note.updatedAt);
        cb(note);
      };
    })
    .catch((e) => console.log("Error processing note update", e));
  return () => {
    closed = true;
    bc.close();
  };
}
