import { TrashIcon } from "@heroicons/react/20/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Circles } from "react-loading-icons";
import { useAction } from "next-safe-action/hook";
import type { deleteList } from "./_actions";

type DeleteOptionProps = {
  listId: string;
  deleteList: typeof deleteList;
};

export default function DeleteOption({ listId, deleteList }: DeleteOptionProps) {
  const { execute, isExecuting } = useAction(deleteList);

  return (
    <DropdownMenu.Item
      className="flex w-full items-center rounded-sm p-2 transition-colors duration-300 hover:bg-gray-800"
      onSelect={() => execute({ id: listId })}
    >
      {isExecuting ? (
        <Circles height="1em" width="1.15em" />
      ) : (
        <TrashIcon className="h-4 w-4" aria-hidden />
      )}
      <span className="ml-4">Delete</span>
    </DropdownMenu.Item>
  );
}
