import { useCurrentUser } from "#/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationResultDto } from "@/index";
import {
  type NotificationResponseDto,
  getNotifications,
} from "#/notifications";

export function useGetNotifications() {
  const { data: user } = useCurrentUser();
  return useInfiniteQuery<PaginationResultDto<NotificationResponseDto>>({
    queryKey: ["notifications", user?.id],
    queryFn: ({ pageParam = 1 }) =>
      getNotifications({
        page: pageParam as number,
        pageSize: 8,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 2,
  });
}
