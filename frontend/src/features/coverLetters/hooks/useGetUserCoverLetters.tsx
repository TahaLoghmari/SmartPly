import { useCurrentUser } from "#/auth";
import { useQuery } from "@tanstack/react-query";
import {
  useCoverLetterSearchbarStore,
  getUserCoverLetters,
} from "#/coverLetters";

export function useGetUserCoverLetters() {
  const { data: user } = useCurrentUser();
  const { search } = useCoverLetterSearchbarStore();
  return useQuery({
    queryKey: ["coverLetters", user?.id, search],
    queryFn: () => getUserCoverLetters(search),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
