import { useQuery } from "@tanstack/react-query";
import { getApplicationStats } from "#/applications";
import { useCurrentUser } from "#/auth";

export function useGetApplicationStats() {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: ["applicationStats", user?.id],
    queryFn: () => getApplicationStats(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
