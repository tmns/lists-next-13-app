import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getLists } from "utils/get";
import Lists from "../lists/(side-nav)/Lists";
import ListsProvider from "../lists/(side-nav)/ListsProvider";
import NewListForm from "../lists/(side-nav)/NewListForm";
import { createList, deleteList, updateList } from "../lists/(side-nav)/_actions";

interface SideNavProps {
  isMobile?: boolean;
}

export default async function SideNav(props: SideNavProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const lists = await getLists(session?.user.id);

  const isMobile = Boolean(props.isMobile);

  return (
    <aside
      className={
        isMobile
          ? "fixed inset-y-0 z-50 flex w-72 flex-col"
          : "shadow-subtle-r hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
      }
    >
      <div className="flex grow flex-col overflow-y-auto bg-default-bg px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center text-3xl text-secondary">☑</div>
        <ListsProvider lists={lists}>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">Your lists</div>
                <ul className="-mx-2 space-y-1">
                  <Lists deleteList={deleteList} updateList={updateList} />
                </ul>
              </li>
            </ul>
          </nav>
          <NewListForm createList={createList} />
        </ListsProvider>
      </div>
    </aside>
  );
}
