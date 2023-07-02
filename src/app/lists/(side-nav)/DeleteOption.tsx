import { TrashIcon } from "@heroicons/react/20/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAction } from "next-safe-action/hook";
import { useListsContext } from "./ListsProvider";
import type { deleteList } from "./_actions";

type DeleteOptionProps = {
  listId: string;
  deleteList: typeof deleteList;
};

export default function DeleteOption({ listId, deleteList }: DeleteOptionProps) {
  const { lists, setLists } = useListsContext();
  const { execute } = useAction(deleteList);

  function executeDelete() {
    void execute({ id: listId });
    setLists(lists.filter((list) => list.id !== listId));
  }

  return (
    <DropdownMenu.Item
      className="flex w-full items-center rounded-sm p-2 transition-colors duration-300 hover:bg-gray-800"
      onSelect={executeDelete}
    >
      <TrashIcon className="h-4 w-4" aria-hidden />
      <span className="ml-4">Delete</span>
    </DropdownMenu.Item>
  );
}
