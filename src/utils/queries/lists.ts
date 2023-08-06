import type { List } from "@prisma/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { useRouter } from "next/navigation";

function getBaseURL() {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function useGetLists(headers: ReadonlyHeaders) {
  const query = useSuspenseQuery({
    queryKey: ["lists"],
    queryFn: async () => {
      try {
        const res = await fetch(`${getBaseURL()}/api/lists`, {
          headers: { "Content-Type": "application/json", ...Object.fromEntries(headers) },
          cache: "no-store",
        });
        const lists = (await res.json()) as List[];
        const sortedLists = lists.sort((a, b) => a.createdAt?.localeCompare(b.createdAt));
        return sortedLists;
      } catch (e) {
        console.log({ e });
      }
    },
  });

  return [query.data as List[], query] as const;
}

export function useCreateList() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (newList: { name: string }) => {
      try {
        const res = await fetch(`${getBaseURL()}/api/lists`, {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify(newList),
        });
        const data = (await res.json()) as List;
        return data;
      } catch (e) {
        console.log({ e });
      }
    },
    onMutate: async (newList) => {
      await queryClient.cancelQueries({ queryKey: ["lists"] });
      const previousLists = queryClient.getQueryData(["lists"]);
      queryClient.setQueryData<List[]>(
        ["lists"],
        (old) => [...(old as List[]), { ...newList, isLoading: true, id: Math.random() }] as List[],
      );
      return { previousLists };
    },
    onError: (err, _, context) => {
      console.log(err);
      queryClient.setQueryData(["lists"], context?.previousLists);
    },
    onSuccess: (data) => {
      router.push(`/lists/${data!.id}`);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedList: { name: string; id: string }) => {
      try {
        const res = await fetch(`${getBaseURL()}/api/lists`, {
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
          body: JSON.stringify(updatedList),
        });
        const data = (await res.json()) as List;
        return data;
      } catch (e) {
        console.log({ e });
      }
    },
    onMutate: async (updatedList) => {
      await queryClient.cancelQueries({ queryKey: ["lists"] });
      const previousLists = queryClient.getQueryData(["lists"]);
      queryClient.setQueryData<List[]>(["lists"], (old) => {
        return old!.map((l) => {
          if (l.id !== updatedList.id) return l;
          return { ...l, ...updatedList };
        });
      });
      return { previousLists };
    },
    onError: (err, _, context) => {
      console.log(err);
      queryClient.setQueryData(["lists"], context?.previousLists);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listToDelete: { id: string }) => {
      try {
        const res = await fetch(`${getBaseURL()}/api/lists`, {
          headers: { "Content-Type": "application/json" },
          method: "DELETE",
          body: JSON.stringify(listToDelete),
        });
        const data = (await res.json()) as List;
        return data;
      } catch (e) {
        console.log({ e });
      }
    },
    onMutate: async (listToDelete) => {
      await queryClient.cancelQueries({ queryKey: ["lists"] });
      const previousLists = queryClient.getQueryData(["lists"]);
      queryClient.setQueryData<List[]>(["lists"], (old) =>
        old!.filter((l) => l.id !== listToDelete.id),
      );
      return { previousLists };
    },
    onError: (err, _, context) => {
      console.log(err);
      queryClient.setQueryData(["lists"], context?.previousLists);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}
