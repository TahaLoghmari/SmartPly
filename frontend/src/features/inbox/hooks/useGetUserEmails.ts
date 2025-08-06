import { useCurrentUser } from "#/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserEmails } from "#/inbox";

export function useGetUserEmails() {
  const { data: user } = useCurrentUser();
  return useInfiniteQuery({
    queryKey: ["emails", user?.id],
    queryFn: ({ pageParam }) => getUserEmails(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
