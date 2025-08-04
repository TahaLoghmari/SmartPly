import { useQuery } from "@tanstack/react-query";
import {
  getUserCoverLetter,
  type CoverLetterResponseDto,
} from "#/coverLetters";

export function useGetUserCoverLetter(id: string | undefined) {
  return useQuery<CoverLetterResponseDto>({
    queryKey: ["coverLetter", id],
    queryFn: () => getUserCoverLetter(id as string),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
