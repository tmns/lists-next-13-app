"use client";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import type { List } from "@prisma/client";
import * as Label from "@radix-ui/react-label";
import { useAction } from "next-safe-action/hook";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Toast from "../Toast";
import type { ProviderList } from "./ListsProvider";
import { useListsContext } from "./ListsProvider";
import type { createList } from "./_actions";

type NewListFormProps = {
  createList: typeof createList;
};

export default function NewListForm({ createList }: NewListFormProps) {
  const { lists, setLists } = useListsContext();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const newListInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { execute, res, reset } = useAction(createList, {
    onSuccess: (data) => router.push(`/lists/${data.id}`),
  });

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
        `You already have a list with the name "${newListName}". Please choose another name.`
      );
      return;
    }

    formRef.current!.reset();

    const optList: ProviderList = {
      name: newListName,
      id: String(Math.random()),
      isLoading: true,
    };

    setLists([...lists, optList]);
    setIsCreating(false);

    void execute({ name: newListName });
  }

  useEffect(() => {
    if (!res.data) return;

    setLists(lists.map((list) => (list.name === res.data!.name ? (res.data as List) : list)));
    reset();
  }, [res, lists, setLists, reset]);

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
