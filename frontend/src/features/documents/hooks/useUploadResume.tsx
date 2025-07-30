import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ResumeRequestDto,
  type ResumeResponseDto,
  uploadResume,
} from "#/documents";
import { useCurrentUser } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useUploadResume() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  return useMutation<ResumeResponseDto, ProblemDetailsDto, ResumeRequestDto>({
    mutationFn: uploadResume,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resumes", user?.id],
      });
    },
    onError: handleApiError,
  });
}
