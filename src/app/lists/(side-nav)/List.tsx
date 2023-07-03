"use client";
import {
  CheckIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Label from "@radix-ui/react-label";
import { useOptimisticAction } from "next-safe-action/hook";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Toast from "../Toast";
import DeleteOption from "./DeleteOption";
import type { ProviderList } from "./ListsProvider";
import type { deleteList, updateList } from "./_actions";

type ListProps = {
  lists: ProviderList[] | undefined;
  list: ProviderList;
  deleteList: typeof deleteList;
  updateList: typeof updateList;
};

export default function ListComponent({ lists, list, deleteList, updateList }: ListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const editNameInputRef = useRef<HTMLInputElement>(null);
  const currentListId = useSelectedLayoutSegment();
  const { execute, optimisticData } = useOptimisticAction(updateList, list);

  useEffect(() => {
    if (!isEditing) return;

    editNameInputRef.current?.select();
  }, [isEditing]);

  function updateName(e: React.SyntheticEvent) {
    e.preventDefault();

    setError("");

    const target = e.target as typeof e.target & {
      name: { value: string };
    };

    const name = target.name.value;

    if (lists?.some((list) => list.name === name)) {
      setError(`You already have a list with the name "${name}". Please choose another name.`);
      return;
    }

    void execute({ id: list.id, name }, { name });
    setIsEditing(false);
  }

  function closeOnEsc(e: React.KeyboardEvent) {
    if (e.key === "Escape") setIsEditing(false);
  }

  return (
    <li
      className={`group/item flex cursor-pointer items-center justify-between rounded-sm text-left text-sm font-semibold leading-6 ${
        currentListId === list.id || list.isLoading
          ? "bg-secondary-bg text-white"
          : "text-gray-400 transition-colors duration-300 hover:bg-secondary-bg hover:text-white"
      } ${list.isLoading ? "pointer-events-none animate-pulse" : ""}`}
    >
      {isEditing ? (
        <form className="flex w-full pl-2" onSubmit={updateName}>
          <Label.Root htmlFor="name" className="sr-only">
            New list name
          </Label.Root>
          <input
            className="w-4/5 bg-transparent pl-2"
            ref={editNameInputRef}
            onKeyUp={closeOnEsc}
            id="name"
            name="name"
            defaultValue={list.name}
          />
          <button className="ml-4 p-2 text-zinc-400 hover:text-white">
            <CheckIcon className="h-4 w-4 transition-colors duration-300" aria-hidden />
            <span className="sr-only">Save new title</span>
          </button>
          <button
            className="p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsEditing(false)}
          >
            <XMarkIcon className="h-4 w-4 transition-colors duration-300" aria-hidden />
            <span className="sr-only">Cancel new title</span>
          </button>
        </form>
      ) : (
        <DropdownMenu.Root>
          <Link
            href={`/lists/${list.id}`}
            className="flex w-full items-center justify-between px-4 py-1"
          >
            <span className="truncate">{optimisticData.name}</span>
            <DropdownMenu.Trigger className="flex h-4 place-items-center rounded-sm transition-colors duration-300 hover:bg-gray-800 hover:text-white group-focus-within/item:opacity-100 group-hover/item:opacity-100 supports-hover:opacity-0">
              <EllipsisHorizontalIcon className="h-6 w-6" aria-hidden />
              <span className="sr-only">Options</span>
            </DropdownMenu.Trigger>
          </Link>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              loop
              side="right"
              sideOffset={-10}
              align="start"
              alignOffset={5}
              className="shadow- z-50 w-56 rounded-md bg-gray-900 p-2 text-sm text-white ring-1 ring-black ring-opacity-5 drop-shadow-xl focus:outline-none radix-state-open:animate-slide-up-fade"
            >
              <DeleteOption listId={list.id} deleteList={deleteList} />
              <DropdownMenu.Item
                className="flex w-full items-center gap-4 rounded-sm p-2 transition-colors duration-300 hover:bg-gray-800"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon className="h-4 w-4" aria-hidden />
                <span>Rename</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
      {error && (
        <Toast
          type="error"
          message={error}
          onCloseCallback={() => {
            setError("");
            editNameInputRef.current?.select();
          }}
        />
      )}
    </li>
  );
}
