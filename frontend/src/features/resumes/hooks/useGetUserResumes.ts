import { useCurrentUser } from "#/auth";
import { useQuery } from "@tanstack/react-query";
import { useResumeSearchbarStore, getUserResumes } from "#/resumes";

export function useGetUserResumes() {
  const { data: user } = useCurrentUser();
  const { search } = useResumeSearchbarStore();
  return useQuery({
    queryKey: ["resumes", user?.id, search],
    queryFn: () => getUserResumes(search),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
