import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type CoverLetterRequestDto,
  type CoverLetterResponseDto,
  uploadCoverLetter,
} from "#/coverLetters";
import { useCurrentUser } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useUploadCoverLetter() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  return useMutation<
    CoverLetterResponseDto,
    ProblemDetailsDto,
    CoverLetterRequestDto
  >({
    mutationFn: uploadCoverLetter,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["coverLetters", user?.id],
      });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
