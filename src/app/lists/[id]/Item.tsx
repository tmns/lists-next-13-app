"use client";
import { CheckIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Label from "@radix-ui/react-label";
import { useAction, useOptimisticAction } from "next-safe-action/hook";
import { startTransition, useEffect, useRef, useState } from "react";
import { Circles } from "react-loading-icons";
import Toast from "../Toast";
import type { deleteItem, updateItem } from "./_actions";

type Item = { id: string; title: string; listId: string; isChecked: boolean };

type ItemProps = {
  item: Item;
  items: Item[];
  updateItem: typeof updateItem;
  deleteItem: typeof deleteItem;
};

export default function Item({ item, items, updateItem, deleteItem }: ItemProps) {
  const editTitleInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const { id, title, isChecked } = item;
  const { execute, isExecuting } = useAction(updateItem, {
    onSuccess: () => {
      startTransition(() => setIsEditing(false));
    },
  });

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

    void execute({ title: editedTitle, id });
  }

  function showEditTitleInput() {
    setIsEditing(true);
  }

  useEffect(() => {
    if (!isEditing) return;

    editTitleInputRef.current?.select();
  }, [isEditing]);

  function closeOnEsc(e: React.KeyboardEvent) {
    if (e.key === "Escape") setIsEditing(false);
  }

  return (
    <li className="group flex items-center p-2">
      <ToggleItemCheck
        itemId={id}
        isChecked={isChecked}
        setError={setError}
        updateItem={updateItem}
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
        <span className={`ml-4 ${isChecked ? "text-zinc-400" : ""} transition-colors duration-300`}>
          {title}
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
              {isExecuting ? (
                <Circles width="1em" height="1em" />
              ) : (
                <CheckIcon className="h-4 w-4 transition-colors duration-300 " aria-hidden />
              )}
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
  const { execute, isExecuting } = useAction(deleteItem);

  // Optimistic "delete".
  if (isExecuting) return null;

  function executeDelete() {
    void execute({ id });
  }

  return (
    <button className="ml-4 p-2 text-zinc-400 hover:text-white" onClick={executeDelete}>
      <TrashIcon className="h-4 w-4 transition-colors duration-300" aria-hidden />
      <span className="sr-only">Delete item</span>
    </button>
  );
}

type ToggleItemCheckProps = {
  itemId: string;
  isChecked: boolean;
  setError: (msg: string) => void;
  updateItem: typeof updateItem;
};

function ToggleItemCheck({ itemId, isChecked, updateItem }: ToggleItemCheckProps) {
  const { execute, optimisticState } = useOptimisticAction(updateItem, { isChecked });

  function toggleItemCheck(isChecked: boolean) {
    void execute({ id: itemId, isChecked }, { isChecked });
  }

  return (
    <Checkbox.Root
      className="flex h-5 w-5 items-center justify-center rounded transition-colors duration-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 radix-state-checked:bg-secondary radix-state-unchecked:bg-zinc-900"
      defaultChecked={optimisticState.isChecked ?? isChecked}
      checked={isChecked}
      onCheckedChange={toggleItemCheck}
    >
      <Checkbox.Indicator>
        <CheckIcon className="h-4 w-4 self-center text-white" />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}
