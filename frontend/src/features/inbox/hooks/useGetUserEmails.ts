import { useCurrentUser } from "#/auth";
import { useQuery } from "@tanstack/react-query";
import { getUserEmails } from "#/inbox";

export function useGetUserEmails() {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: ["emails", user?.id],
    queryFn: () => getUserEmails(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
