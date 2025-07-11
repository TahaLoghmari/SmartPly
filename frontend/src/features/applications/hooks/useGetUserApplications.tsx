import { useCurrentUser } from "#/auth";
import { useQuery } from "@tanstack/react-query";
import { getUserApplications } from "#/applications";

export function useGetUserApplications() {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: ["applications", user?.id],
    queryFn: () => getUserApplications(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
}
