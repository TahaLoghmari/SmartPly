import { useQuery } from "@tanstack/react-query";
import { getUserEmail, type Message } from "#/inbox";

export function useGetUserEmail({ id }: { id: string }) {
  return useQuery<Message>({
    queryKey: ["email", id],
    queryFn: () => getUserEmail(id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
