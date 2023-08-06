"use client";
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/20/solid";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Label from "@radix-ui/react-label";
import { useEffect, useRef, useState } from "react";
import Toast from "../Toast";
import { useDeleteItem, useUpdateItem } from "utils/queries/items";
import type { Item } from "@prisma/client";

type OptimisticItem = Item & { isLoading?: boolean };

type ItemProps = {
  item: OptimisticItem;
  items: OptimisticItem[];
  listId: string;
};

export default function ItemComponent({ item, items, listId }: ItemProps) {
  const editTitleInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [titleCopied, setTitleCopied] = useState(false);
  const [error, setError] = useState("");
  const { mutate } = useUpdateItem(listId);

  useEffect(() => {
    if (!isEditing) return;

    editTitleInputRef.current?.select();
  }, [isEditing]);

  function updateTitle(e: React.SyntheticEvent) {
    e.preventDefault();

    setError("");

    const target = e.target as typeof e.target & {
      editedTitle: { value: string };
    };

    const editedTitle = target.editedTitle.value;

    if (items.some((item) => item.title === editedTitle)) {
      setError(
        `You already have an item with the title "${editedTitle}". Please choose another name.`,
      );
      return;
    }

    mutate({ title: editedTitle, id: item.id });
    setIsEditing(false);
  }

  function showEditTitleInput() {
    setIsEditing(true);
  }

  function closeOnEsc(e: React.KeyboardEvent) {
    if (e.key === "Escape") setIsEditing(false);
  }

  async function copyTitle() {
    await navigator.clipboard.writeText(item.title);
    setTitleCopied(true);
    setTimeout(() => setTitleCopied(false), 500);
  }

  return (
    <li className="item group peer flex items-center p-2">
      <ToggleItemCheck id={item.id} isChecked={item.isChecked} listId={listId} />
      {isEditing ? (
        <>
          <form id="edit-title-form" className="flex-1" onSubmit={updateTitle}>
            <Label.Root htmlFor="editedTitle" className="sr-only">
              Edit title
            </Label.Root>
            <input
              className="ml-2 w-full bg-transparent px-2"
              ref={editTitleInputRef}
              onKeyUp={closeOnEsc}
              id="editedTitle"
              name="editedTitle"
              defaultValue={item.title}
              required
            />
          </form>
        </>
      ) : (
        <span
          className={`ml-4 truncate text-ellipsis ${
            item.isChecked ? "text-zinc-400" : ""
          } transition-colors duration-300`}
        >
          {item.title}
        </span>
      )}
      <div
        className={`${
          isEditing ? "opacity-100" : "supports-hover:opacity-0"
        } ml-auto flex items-center focus-within:opacity-100 group-hover:opacity-100`}
      >
        {isEditing ? (
          <>
            <button form="edit-title-form" className="ml-4 p-2 text-zinc-400 hover:text-white">
              <CheckIcon className="h-4 w-4 transition-colors duration-300 " aria-hidden />
              <span className="sr-only">Save new title</span>
            </button>
            <button
              className="p-2 text-zinc-400 hover:text-white"
              onClick={() => setIsEditing(false)}
            >
              <XMarkIcon className="h-4 w-4 transition-colors duration-300 " aria-hidden />
              <span className="sr-only">Cancel new title</span>
            </button>
          </>
        ) : (
          <>
            <button className="p-2 text-zinc-400 hover:text-white" onClick={copyTitle}>
              {titleCopied ? (
                <ClipboardDocumentCheckIcon
                  className="h-4 w-4 transition-colors duration-300 "
                  aria-hidden
                />
              ) : (
                <ClipboardDocumentIcon
                  className="h-4 w-4 transition-colors duration-300 "
                  aria-hidden
                />
              )}
              <span className="sr-only">Copy item title</span>
            </button>
            <button className="p-2 text-zinc-400 hover:text-white" onClick={showEditTitleInput}>
              <PencilIcon className="h-4 w-4 transition-colors duration-300 " aria-hidden />
              <span className="sr-only">Edit item title</span>
            </button>
          </>
        )}
        <DeleteItemBtn id={item.id} listId={listId} />
      </div>
      {error && (
        <Toast
          type="error"
          message={error}
          onCloseCallback={() => {
            setError("");
            editTitleInputRef.current?.select();
          }}
        />
      )}
    </li>
  );
}

type DeleteItemBtnProps = {
  id: string;
  listId: string;
};

function DeleteItemBtn({ id, listId }: DeleteItemBtnProps) {
  const { mutate } = useDeleteItem(listId);

  function executeDelete() {
    mutate({ id });
  }

  return (
    <button className="ml-4 p-2 text-zinc-400 hover:text-white" onClick={executeDelete}>
      <TrashIcon className="h-4 w-4 transition-colors duration-300" aria-hidden />
      <span className="sr-only">Delete item</span>
    </button>
  );
}

type ToggleItemCheckProps = {
  id: string;
  isChecked: boolean;
  listId: string;
};

function ToggleItemCheck({ id, isChecked, listId }: ToggleItemCheckProps) {
  const { mutate, isPending } = useUpdateItem(listId);

  function toggleCheck() {
    mutate({ id, isChecked: !isChecked });
  }

  return (
    <Checkbox.Root
      className="flex h-5 w-5 shrink-0 basis-5 items-center justify-center rounded transition-colors duration-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 radix-state-checked:bg-secondary radix-state-unchecked:bg-slate-800"
      defaultChecked={isChecked}
      checked={isChecked}
      onCheckedChange={toggleCheck}
      disabled={isPending}
    >
      <Checkbox.Indicator>
        <CheckIcon className="h-4 w-4 self-center text-white" />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}
