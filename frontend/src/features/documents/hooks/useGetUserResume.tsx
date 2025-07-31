import { useQuery } from "@tanstack/react-query";
import {
  getUserResume,
  type ResumeGetRequestDto,
  type ResumeResponseDto,
} from "#/documents";

export function useGetUserResume(credentials: ResumeGetRequestDto) {
  return useQuery<ResumeResponseDto>({
    queryKey: ["resume", credentials.id],
    queryFn: () => getUserResume(credentials),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
