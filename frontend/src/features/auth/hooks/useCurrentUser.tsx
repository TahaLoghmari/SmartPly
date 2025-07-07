import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "#/auth";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      // Don't retry on any authentication errors
      if (
        error.message === "Session expired" ||
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        return false;
      }
      return failureCount < 1;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't auto-fetch on mount for login page
    refetchOnReconnect: false, // Don't auto-fetch on reconnect for unauthenticated users
  });
}
