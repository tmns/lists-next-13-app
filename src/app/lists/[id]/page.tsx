import { getItems } from "utils/get";
import NewItemForm from "./NewItemForm";
import { createItem, deleteItem, updateItem } from "./_actions";
import ItemsProvider from "./ItemsProvider";
import Items from "./Items";

type RouteProps = {
  params: { id: string };
};

export default async function List({ params }: RouteProps) {
  const items = await getItems(params.id);

  return (
    <ItemsProvider items={items}>
      <ul className="divide-y divide-zinc-400/40 px-3 py-2 sm:px-4 lg:px-2">
        <Items deleteItem={deleteItem} updateItem={updateItem} />
      </ul>
      <NewItemForm listId={params.id} createItem={createItem} />
    </ItemsProvider>
  );
}
