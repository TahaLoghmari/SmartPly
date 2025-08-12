import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, type User } from "#/auth";

export function useCurrentUser() {
  return useQuery<User>({
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
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: (query) => {
      const user = query.state.data;
      return user && !user.isInitialSyncComplete ? 5000 : false;
    },
    refetchIntervalInBackground: true,
  });
}
