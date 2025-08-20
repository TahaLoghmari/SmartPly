import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkDeleteCoverLetters } from "#/coverLetters";
import {
  type ProblemDetailsDto,
  type BulkDeleteRequestDto,
} from "@/types/api.types";
import { useCurrentUser } from "#/auth";
import { handleApiError } from "@/index";

export function useBulkDeleteCoverLetters() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation<void, ProblemDetailsDto, BulkDeleteRequestDto>({
    mutationFn: bulkDeleteCoverLetters,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverLetters", user?.id] });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
