import NewItemForm from "./NewItemForm";
import Items from "./Items";
import { Suspense } from "react";
import { headers } from "next/headers";

type RouteProps = {
  params: { id: string };
};

export default function List({ params }: RouteProps) {
  return (
    <>
      <Suspense fallback={<ItemsSkeleton />}>
        <ul className="divide-y divide-zinc-400/40 px-3 py-2 sm:px-4 lg:px-2">
          <Items listId={params.id} headers={headers()} />
        </ul>
      </Suspense>
      <Suspense fallback={<NewItemSkeleton />}>
        <NewItemForm listId={params.id} headers={headers()} />
      </Suspense>
    </>
  );
}

function ItemsSkeleton() {
  return (
    <ul className="animate-pulse divide-y divide-zinc-400/40 px-3 py-2 sm:px-4 lg:px-2">
      <div className="flex h-[49px] items-center gap-4 p-2">
        <div className="h-5 w-5 bg-secondary-bg" />
        <div className="h-5 w-1/4 bg-secondary-bg" />
      </div>
      <div className="flex h-12 items-center gap-4 p-2">
        <div className="h-5 w-5 bg-secondary-bg" />
        <div className="h-5 w-7/12 bg-secondary-bg" />
      </div>
      <div className="flex h-12 items-center gap-4 p-2">
        <div className="h-5 w-5 bg-secondary-bg" />
        <div className="h-5 w-2/3 bg-secondary-bg" />
      </div>
      <div className="flex h-12 items-center gap-4 p-2">
        <div className="h-5 w-5 bg-secondary-bg" />
        <div className="h-5 w-2/5 bg-secondary-bg" />
      </div>
      <div className="flex h-12 items-center gap-4 p-2">
        <div className="h-5 w-5 bg-secondary-bg" />
        <div className="h-5 w-5/12 bg-secondary-bg" />
      </div>
    </ul>
  );
}

function NewItemSkeleton() {
  return (
    <div className="mt-auto flex animate-pulse items-center gap-4 px-5 py-4 sm:px-6 lg:px-4">
      <div className="h-6 w-16 bg-secondary-bg" />
      <div className="h-8 w-2/3 flex-1 bg-secondary-bg" />
      <div className="h-6 w-6 bg-secondary-bg" />
    </div>
  );
}
