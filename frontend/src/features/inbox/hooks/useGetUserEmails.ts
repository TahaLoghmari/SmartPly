import { useCurrentUser } from "#/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserEmails, type PaginatedEmailResponse } from "#/inbox";

export function useGetUserEmails() {
  const { data: user } = useCurrentUser();
  return useInfiniteQuery<PaginatedEmailResponse>({
    queryKey: ["emails", user?.id],
    queryFn: ({ pageParam }) => getUserEmails(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
