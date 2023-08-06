import type { List, Item } from "@prisma/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

function getBaseURL() {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function useGetItems(listId: string, headers: ReadonlyHeaders) {
  const query = useSuspenseQuery({
    queryKey: ["lists", listId, "items"],
    queryFn: async () => {
      try {
        const res = await fetch(`${getBaseURL()}/api/items?listId=${listId}`, {
          headers: { "Content-Type": "application/json", ...Object.fromEntries(headers) },
          cache: "no-store",
        });
        const items = (await res.json()) as Item[];
        const sortedItems = items.sort((a, b) => a.createdAt?.localeCompare(b.createdAt));
        return sortedItems;
      } catch (e) {
        console.log({ e });
      }
    },
  });

  return [query.data as Item[], query] as const;
}

export function useCreateItem(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: { title: string; listId: string }) => {
      try {
        const res = await fetch(`${getBaseURL()}/api/items`, {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify(newItem),
        });
        const data = (await res.json()) as List;
        return data;
      } catch (e) {
        console.log({ e });
      }
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["lists", listId, "items"] });
      const previousItems = queryClient.getQueryData(["lists", listId, "items"]);
      queryClient.setQueryData<Item[]>(
        ["lists", listId, "items"],
        (old) => [...(old as Item[]), { ...newItem, isLoading: true, id: Math.random() }] as Item[],
      );
      return { previousItems };
    },
    onError: (err, _, context) => {
      console.log(err);
      queryClient.setQueryData(["lists", listId, "items"], context?.previousItems);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["lists", listId, "items"] });
    },
  });
}

export function useUpdateItem(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedItem: { title?: string; isChecked?: boolean; id: string }) => {
      try {
        const res = await fetch(`${getBaseURL()}/api/items`, {
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
          body: JSON.stringify(updatedItem),
        });
        const data = (await res.json()) as Item;
        return data;
      } catch (e) {
        console.log({ e });
      }
    },
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey: ["lists", listId, "items"] });
      const previousItems = queryClient.getQueryData(["lists", listId, "items"]);
      queryClient.setQueryData<Item[]>(["lists", listId, "items"], (old) => {
        return old!.map((i) => {
          if (i.id !== updatedItem.id) return i;
          return { ...i, ...updatedItem };
        });
      });
      return { previousItems };
    },
    onError: (err, _, context) => {
      console.log(err);
      queryClient.setQueryData(["lists", listId, "items"], context?.previousItems);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["lists", listId, "items"] });
    },
  });
}

export function useDeleteItem(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemToDelete: { id: string }) => {
      try {
        const res = await fetch(`${getBaseURL()}/api/items`, {
          headers: { "Content-Type": "application/json" },
          method: "DELETE",
          body: JSON.stringify(itemToDelete),
        });
        const data = (await res.json()) as List;
        return data;
      } catch (e) {
        console.log({ e });
      }
    },
    onMutate: async (itemToDelete) => {
      await queryClient.cancelQueries({ queryKey: ["lists", listId, "items"] });
      const previousItems = queryClient.getQueryData(["lists", listId, "items"]);
      queryClient.setQueryData<Item[]>(["lists", listId, "items"], (old) =>
        old!.filter((l) => l.id !== itemToDelete.id),
      );
      return { previousItems };
    },
    onError: (err, _, context) => {
      console.log(err);
      queryClient.setQueryData(["lists", listId, "items"], context?.previousItems);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["lists", listId, "items"] });
    },
  });
}
