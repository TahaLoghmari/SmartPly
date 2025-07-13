import { useCurrentUser } from "#/auth";
import { useQuery } from "@tanstack/react-query";
import {
  getUserApplications,
  useApplicationStatusFilterStore,
  useApplicationTypeFilterStore,
  useApplicationLevelFilterStore,
  useApplicationJobTypeFilterStore,
  useApplicationSearchBarStore,
} from "#/applications";

export function useGetUserApplications() {
  const { data: user } = useCurrentUser();
  const { selectedFilter: status } = useApplicationStatusFilterStore();
  const { selectedFilter: type } = useApplicationTypeFilterStore();
  const { selectedFilter: level } = useApplicationLevelFilterStore();
  const { selectedFilter: jobType } = useApplicationJobTypeFilterStore();
  const { search } = useApplicationSearchBarStore();
  return useQuery({
    queryKey: ["applications", user?.id, status, type, level, jobType, search],
    queryFn: () =>
      getUserApplications({ status, type, level, jobType, search }),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 2,
  });
}
