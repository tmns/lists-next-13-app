import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "pages/api/auth/[...nextauth]";
import Lists from "../lists/(side-nav)/Lists";
import NewListForm from "../lists/(side-nav)/NewListForm";
import { Suspense } from "react";
import { headers } from "next/headers";

interface SideNavProps {
  isMobile?: boolean;
}

export default async function SideNav(props: SideNavProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const isMobile = Boolean(props.isMobile);

  return (
    <aside
      className={
        isMobile
          ? "fixed inset-y-0 z-50 flex w-72 flex-col"
          : "hidden shadow-subtle-r lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
      }
    >
      <div className="flex grow flex-col overflow-y-auto bg-default-bg px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center text-3xl text-secondary">☑</div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">Your lists</div>
              <ul className="-mx-2 space-y-1">
                <Suspense fallback={<ListsSkeleton />}>
                  <Lists headers={headers()} />
                </Suspense>
              </ul>
            </li>
          </ul>
        </nav>
        <Suspense fallback={<NewListSkeleton />}>
          <NewListForm headers={headers()} />
        </Suspense>
      </div>
    </aside>
  );
}

function ListsSkeleton() {
  return (
    <>
      <div className="h-8 w-full animate-pulse rounded-sm bg-secondary-bg" />
      <div className="h-8 w-full animate-pulse rounded-sm bg-secondary-bg" />
      <div className="h-8 w-full animate-pulse rounded-sm bg-secondary-bg" />
      <div className="h-8 w-full animate-pulse rounded-sm bg-secondary-bg" />
      <div className="h-8 w-full animate-pulse rounded-sm bg-secondary-bg" />
    </>
  );
}

function NewListSkeleton() {
  return (
    <div className="flex h-10 animate-pulse gap-2 px-2">
      <div className="h-5 w-5 rounded-sm bg-secondary-bg" />
      <div className="h-5 w-20 rounded-sm bg-secondary-bg" />
    </div>
  );
}
