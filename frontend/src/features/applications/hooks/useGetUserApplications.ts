import { useCurrentUser } from "#/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getUserApplications,
  useApplicationStatusFilterStore,
  useApplicationTypeFilterStore,
  useApplicationLevelFilterStore,
  useApplicationJobTypeFilterStore,
  useApplicationSearchBarStore,
  type ApplicationResponseDto,
} from "#/applications";
import type { PaginationResultDto } from "@/index";

export function useGetUserApplications() {
  const { data: user } = useCurrentUser();
  const { selectedFilter: status } = useApplicationStatusFilterStore();
  const { selectedFilter: type } = useApplicationTypeFilterStore();
  const { selectedFilter: level } = useApplicationLevelFilterStore();
  const { selectedFilter: jobType } = useApplicationJobTypeFilterStore();
  const { search } = useApplicationSearchBarStore();
  return useInfiniteQuery<PaginationResultDto<ApplicationResponseDto>>({
    queryKey: ["applications", user?.id, status, type, level, jobType, search],
    queryFn: ({ pageParam = 1 }) =>
      getUserApplications({
        status,
        type,
        level,
        jobType,
        search,
        page: pageParam as number,
        pageSize: 8,
      }),
    initialPageParam: 1,
    // this is how you tell TanStack Query how to get the next page
    // lastPage is the data returned from your last API call. If lastPage.hasNextPage is true, return the next page number.
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 2,
  });
}
