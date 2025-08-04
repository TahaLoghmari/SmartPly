import { useQuery } from "@tanstack/react-query";
import { getUserResume, type ResumeResponseDto } from "#/resumes";

export function useGetUserResume(id: string | undefined) {
  return useQuery<ResumeResponseDto>({
    queryKey: ["resume", id],
    queryFn: () => getUserResume(id as string),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
