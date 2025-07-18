import { useCurrentUser } from "#/auth";
import { useQuery } from "@tanstack/react-query";
import { useDocumentSearchBarStore, getUserResumes } from "#/documents";

export function useGetUserResumes() {
  const { data: user } = useCurrentUser();
  const { search } = useDocumentSearchBarStore();
  return useQuery({
    queryKey: ["resumes", user?.id, search],
    queryFn: () => getUserResumes(search),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
