import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getLists } from "utils/get";
import List from "./List";
import NewListForm from "./NewListForm";
import { createList, deleteList, updateList } from "./_actions";

export default async function SideNav() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const lists = await getLists(session?.user.id);

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col overflow-y-auto bg-default-bg px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center text-3xl text-secondary">☑</div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">Your lists</div>
              <ul className="-mx-2 space-y-1">
                {lists?.map((list) => (
                  <List
                    key={list.id}
                    lists={lists}
                    list={list}
                    deleteList={deleteList}
                    updateList={updateList}
                  />
                ))}
              </ul>
            </li>
          </ul>
        </nav>
        <NewListForm lists={lists} createList={createList} />
      </div>
    </aside>
  );
}
