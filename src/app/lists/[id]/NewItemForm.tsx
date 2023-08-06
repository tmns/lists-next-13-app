"use client";
import { PlusIcon } from "@heroicons/react/20/solid";
import * as Label from "@radix-ui/react-label";
import { useRef, useState } from "react";
import Toast from "../Toast";
import { useCreateItem, useGetItems } from "utils/queries/items";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

type NewItemFormProps = {
  listId: string;
  headers: ReadonlyHeaders;
};

export default function NewItemForm({ listId, headers }: NewItemFormProps) {
  const [items] = useGetItems(listId, headers);
  const [error, setError] = useState("");
  const newItemInputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useCreateItem(listId);

  function addNewItem(e: React.SyntheticEvent) {
    e.preventDefault();

    setError("");

    const target = e.target as typeof e.target & {
      title: { value: string };
      reset: () => void;
    };

    const newItemTitle = target.title.value;

    if (items?.some((item) => item.title === newItemTitle)) {
      setError(
        `You already have an item with the title "${newItemTitle}". Please choose another name.`,
      );
      return;
    }

    mutate({ title: newItemTitle, listId });

    target.reset();
    newItemInputRef.current?.focus();
  }

  return (
    <div className="mt-auto px-5 py-4 sm:px-6 lg:px-4">
      <form className="flex items-center" onSubmit={addNewItem}>
        <Label.Root htmlFor="title">Add item</Label.Root>
        <input
          className="ml-4 flex-1 border-l-0 border-r-0 border-t-0 border-zinc-400 bg-transparent px-2 transition-colors duration-300 hover:border-white focus:border-white"
          ref={newItemInputRef}
          type="text"
          id="title"
          name="title"
          required
        />
        <button className="flex items-center p-2 text-zinc-400 transition-colors duration-300 hover:text-white focus:text-white">
          <PlusIcon className="h-5 w-5 " aria-hidden />
          <span className="sr-only">Add item</span>
        </button>
      </form>
      {error && (
        <Toast
          type="error"
          message={error}
          onCloseCallback={() => {
            setError("");
            newItemInputRef.current?.select();
          }}
        />
      )}
    </div>
  );
}
