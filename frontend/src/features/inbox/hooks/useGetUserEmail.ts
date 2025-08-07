import { useQuery } from "@tanstack/react-query";
import { getUserEmail, type Email } from "#/inbox";

export function useGetUserEmail({ id }: { id: string }) {
  return useQuery<Email>({
    queryKey: ["email", id],
    queryFn: () => getUserEmail(id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
