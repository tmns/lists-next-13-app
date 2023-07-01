"use client";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import * as Label from "@radix-ui/react-label";
import { useAction } from "next-safe-action/hook";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Circles } from "react-loading-icons";
import Toast from "../Toast";
import type { createList } from "./_actions";

type List = { id: string; name: string };

type NewListFormProps = {
  lists: List[] | undefined;
  createList: typeof createList;
};

export default function NewListForm({ lists, createList }: NewListFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const newListInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { execute, isExecuting } = useAction(createList, {
    onSuccess: (data) => {
      setIsCreating(false);
      router.push(`/lists/${data.id}`);
    },
  });

  function addList(formData: FormData) {
    const newListName = formData.get("listName") as string;

    if (!newListName) return;

    if (lists?.some((list) => list.name === newListName)) {
      setError(
        `You already have a list with the name "${newListName}". Please choose another name.`
      );
      return;
    }

    formRef.current!.reset();

    void execute({ name: newListName });
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
          <form className="p-4 pl-1 pr-0" action={addList} ref={formRef}>
            <Label.Root htmlFor="listName">List name</Label.Root>
            <div className="mt-1 flex justify-between">
              <input
                className="w-44 rounded-sm border border-l-0 border-r-0 border-t-0 border-zinc-400 bg-transparent px-2"
                ref={newListInputRef}
                onKeyUp={closeOnEsc}
                type="text"
                id="listName"
                name="listName"
                required
              />
              <button className="-m-2 mr-0 p-2 transition-colors duration-300 hover:text-white">
                {isExecuting ? (
                  <Circles height="1em" width="1.25em" fill="currentColor" />
                ) : (
                  <PlusIcon className="h-5 w-5" aria-hidden />
                )}
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
