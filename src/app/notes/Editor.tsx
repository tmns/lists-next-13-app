"use client";
import type { Note } from "@prisma/client";
import Focus from "@tiptap/extension-focus";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import type { Content, Editor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDataSubscription } from "lib/useDataSubscription";
import { useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { updateNote } from "./_actions";

interface EditorProps {
  note: Note;
}

export default function EditorComponent({ note }: EditorProps) {
  const instanceId = useMemo<string>(() => nanoid(), []);
  const [content, setContent] = useState(() => JSON.parse(note.content) as Content);

  // General approach taken from https://github.com/denoland/tic-tac-toe
  useDataSubscription(() => {
    const eventSource = new EventSource("/events/notes");

    eventSource.onmessage = (e) => {
      const updatedNote = JSON.parse(e.data as string) as Note | null;
      if (!updatedNote || instanceId === updatedNote.instanceId) return;

      setContent(JSON.parse(updatedNote.content) as Content);
    };

    return () => eventSource.close();
  }, []);

  const editor = useEditor({
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg prose-p:text-white prose-headings:text-red-700 prose-code:text-red-700 prose-pre:text-red-700 prose-code:bg-slate-900 prose-pre:bg-slate-900 mx-auto focus:outline-none py-6 px-4 sm:px-6 lg:px-2 rounded-b-md h-100vh overflow-y-auto max-h-[calc(100vh_-_74px)]",
      },
    },
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") return `H${node.attrs.level as string}`;
          if (node.type.name === "codeBlock") return "Enter some code...";
          return "Enter some text...";
        },
        showOnlyCurrent: false,
        showOnlyWhenEditable: false,
      }),
      Focus.configure({ className: "focused" }),
      Highlight,
      Typography,
    ],
    onUpdate({ editor }) {
      sendUpdatedContent(editor as Editor, note.id, instanceId);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(content);
  }, [editor, content]);

  return <EditorContent editor={editor} />;
}

type UpdateNoteFetch = (editor: Editor, id: string, instanceId: string) => void;

const sendUpdatedContent = debounce((editor, id, instanceId) => {
  const content = editor.getJSON();

  const data = { id, content: JSON.stringify(content), instanceId };
  void updateNote(data);
}, 400);

function debounce(func: UpdateNoteFetch, wait: number) {
  let timeout: NodeJS.Timeout | null;

  return function executedFunction(...args: [editor: Editor, id: string, instanceId: string]) {
    const later = () => {
      timeout = null;
      void func(...args);
    };

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(later, wait);
  };
}
