"use client";
import { CheckIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Label from "@radix-ui/react-label";
import { useAction, useOptimisticAction } from "next-safe-action/hook";
import { useEffect, useRef, useState } from "react";
import Toast from "../Toast";
import type { ProviderItem } from "./ItemsProvider";
import { useItemsContext } from "./ItemsProvider";
import type { deleteItem, updateItem } from "./_actions";

type ItemProps = {
  item: ProviderItem;
  items: ProviderItem[];
  updateItem: typeof updateItem;
  deleteItem: typeof deleteItem;
};

export default function ItemComponent({ item, items, updateItem, deleteItem }: ItemProps) {
  const editTitleInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const { id, title } = item;
  const { execute, isExecuting, optimisticData } = useOptimisticAction(updateItem, item);

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
        `You already have an item with the title "${editedTitle}". Please choose another name.`
      );
      return;
    }

    void execute({ title: editedTitle, id }, { title: editedTitle });
    setIsEditing(false);
  }

  function toggleCheck(isChecked: boolean) {
    void execute({ isChecked, id }, { isChecked });
  }

  function showEditTitleInput() {
    setIsEditing(true);
  }

  function closeOnEsc(e: React.KeyboardEvent) {
    if (e.key === "Escape") setIsEditing(false);
  }

  return (
    <li className="group flex items-center p-2">
      <ToggleItemCheck
        isChecked={optimisticData.isChecked}
        setError={setError}
        toggleCheck={toggleCheck}
        isExecuting={isExecuting}
      />
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
              defaultValue={title}
              required
            />
          </form>
        </>
      ) : (
        <span
          className={`ml-4 ${
            optimisticData.isChecked ? "text-zinc-400" : ""
          } transition-colors duration-300`}
        >
          {optimisticData.title}
        </span>
      )}
      <div
        className={`${
          isEditing ? "opacity-100" : "opacity-0"
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
          <button className="p-2 text-zinc-400 hover:text-white" onClick={showEditTitleInput}>
            <PencilIcon className="h-4 w-4 transition-colors duration-300 " aria-hidden />
            <span className="sr-only">Edit item title</span>
          </button>
        )}
        <DeleteItemBtn id={item.id} deleteItem={deleteItem} />
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
  deleteItem: typeof deleteItem;
};

function DeleteItemBtn({ id, deleteItem }: DeleteItemBtnProps) {
  const { items, setItems } = useItemsContext();
  const { execute } = useAction(deleteItem);

  function executeDelete() {
    void execute({ id });
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <button className="ml-4 p-2 text-zinc-400 hover:text-white" onClick={executeDelete}>
      <TrashIcon className="h-4 w-4 transition-colors duration-300" aria-hidden />
      <span className="sr-only">Delete item</span>
    </button>
  );
}

type ToggleItemCheckProps = {
  isChecked: boolean;
  setError: (msg: string) => void;
  toggleCheck: (isChecked: boolean) => void;
  isExecuting: boolean;
};

function ToggleItemCheck({ isExecuting, toggleCheck, isChecked }: ToggleItemCheckProps) {
  return (
    <Checkbox.Root
      className="flex h-5 w-5 items-center justify-center rounded transition-colors duration-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 radix-state-checked:bg-secondary radix-state-unchecked:bg-slate-800"
      defaultChecked={isChecked}
      checked={isChecked}
      onCheckedChange={toggleCheck}
      disabled={isExecuting}
    >
      <Checkbox.Indicator>
        <CheckIcon className="h-4 w-4 self-center text-white" />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}
