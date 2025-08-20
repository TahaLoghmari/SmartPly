import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, type User } from "#/auth";
import type { ProblemDetailsDto } from "@/types/api.types";

export function useCurrentUser() {
  return useQuery<User, ProblemDetailsDto>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
