"use client";
import { PlusIcon } from "@heroicons/react/20/solid";
import * as Label from "@radix-ui/react-label";
import { useAction } from "next-safe-action/hook";
import { useRef, useState } from "react";
import { Circles } from "react-loading-icons";
import Toast from "../Toast";
import type { createItem } from "./_actions";

type Item = { id: string; title: string; listId: string; isChecked: boolean };

type NewItemFormProps = {
  listId: string;
  items: Item[] | undefined;
  createItem: typeof createItem;
};

export default function NewItemForm({ listId, items, createItem }: NewItemFormProps) {
  const [error, setError] = useState("");
  const newItemInputRef = useRef<HTMLInputElement>(null);

  const { execute, isExecuting } = useAction(createItem);

  async function addNewItem(e: React.SyntheticEvent) {
    e.preventDefault();

    setError("");

    const target = e.target as typeof e.target & {
      title: { value: string };
      reset: () => void;
    };

    const newItemTitle = target.title.value;

    if (items?.some((item) => item.title === newItemTitle)) {
      setError(
        `You already have an item with the title "${newItemTitle}". Please choose another name.`
      );
      return;
    }

    await execute({ title: newItemTitle, listId });

    target.reset();
    newItemInputRef.current?.focus();
  }

  return (
    <div className="mt-auto px-5 sm:px-6 py-4 lg:px-4">
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
          {isExecuting ? (
            <Circles height="1.25em" width="1.25em" />
          ) : (
            <PlusIcon className="h-5 w-5 " aria-hidden />
          )}
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
