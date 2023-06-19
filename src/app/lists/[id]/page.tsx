import { getItems } from "utils/get";
import Item from "./Item";
import NewItemForm from "./NewItemForm";
import { createItem, deleteItem, updateItem } from "./_actions";

type RouteProps = {
  params: { id: string };
};

export default async function List({ params }: RouteProps) {
  const items = await getItems(params.id);

  return (
    <>
      <ul className="divide-y divide-zinc-400/40 p-2">
        {items.map((item) => {
          return (
            <Item
              item={item}
              items={items}
              key={item.id}
              updateItem={updateItem}
              deleteItem={deleteItem}
            />
          );
        })}
      </ul>
      <NewItemForm listId={params.id} items={items} createItem={createItem} />
    </>
  );
}
