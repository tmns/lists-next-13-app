import { TrashIcon } from "@heroicons/react/20/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useDeleteList } from "utils/queries/lists";

type DeleteOptionProps = {
  listId: string;
};

export default function DeleteOption({ listId }: DeleteOptionProps) {
  const { mutate } = useDeleteList();

  function executeDelete() {
    mutate({ id: listId });
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
