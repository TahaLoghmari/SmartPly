import { useCurrentUser } from "#/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserEmails, type Email } from "#/inbox";
import type { PaginationResultDto } from "@/index";

export function useGetUserEmails() {
  const { data: user } = useCurrentUser();
  return useInfiniteQuery<PaginationResultDto<Email>>({
    queryKey: ["emails", user?.id],
    queryFn: ({ pageParam = 1 }) =>
      getUserEmails({ page: pageParam as number, pageSize: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
