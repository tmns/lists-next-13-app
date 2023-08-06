"use client";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import * as Label from "@radix-ui/react-label";
import { useEffect, useRef, useState } from "react";
import Toast from "../Toast";
import { useCreateList, useGetLists } from "utils/queries/lists";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

type NewListFormProps = {
  headers: ReadonlyHeaders;
};

export default function NewListForm({ headers }: NewListFormProps) {
  const [lists] = useGetLists(headers);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const newListInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { mutate } = useCreateList();

  function addList(e: React.SyntheticEvent) {
    e.preventDefault();

    setError("");

    const target = e.target as typeof e.target & {
      name: { value: string };
      reset: () => void;
    };

    const newListName = target.name.value;

    if (lists?.some((list) => list.name === newListName)) {
      setError(
        `You already have a list with the name "${newListName}". Please choose another name.`,
      );
      return;
    }

    formRef.current!.reset();

    setIsCreating(false);

    void mutate({ name: newListName });
  }

  useEffect(() => {
    if (!isCreating) return;

    newListInputRef.current?.focus();
  }, [isCreating]);

  function closeOnEsc(e: React.KeyboardEvent) {
    if (e.key === "Escape") setIsCreating(false);
  }

  return (
    <div className="relative mt-auto w-full text-start text-gray-400 shadow-subtle-t">
      {isCreating ? (
        <>
          <button
            className="absolute right-0 top-0 p-2 hover:text-white"
            onClick={() => setIsCreating(false)}
          >
            <XMarkIcon className="h-5 w-5 transition-colors duration-300" aria-hidden />
            <span className="sr-only">Cancel adding list</span>
          </button>
          <form className="p-4 pl-1 pr-0" onSubmit={addList} ref={formRef}>
            <Label.Root htmlFor="name">List name</Label.Root>
            <div className="mt-1 flex justify-between">
              <input
                className="w-44 rounded-sm border border-l-0 border-r-0 border-t-0 border-zinc-400 bg-transparent px-2"
                ref={newListInputRef}
                onKeyUp={closeOnEsc}
                type="text"
                id="name"
                name="name"
                required
              />
              <button className="-m-2 mr-0 p-2 transition-colors duration-300 hover:text-white">
                <PlusIcon className="h-5 w-5" aria-hidden />
                <span className="sr-only">Add list</span>
              </button>
            </div>
          </form>
        </>
      ) : (
        <button
          className="flex w-full items-center rounded-md p-4 pl-1 transition-colors duration-300 hover:bg-secondary-bg hover:text-white"
          onClick={() => setIsCreating(true)}
        >
          <PlusIcon className="h-5 w-5" aria-hidden />
          <span className="ml-2">New list</span>
        </button>
      )}
      {error && (
        <Toast
          type="error"
          message={error}
          onCloseCallback={() => {
            setError("");
            newListInputRef.current?.select();
          }}
        />
      )}
    </div>
  );
}
