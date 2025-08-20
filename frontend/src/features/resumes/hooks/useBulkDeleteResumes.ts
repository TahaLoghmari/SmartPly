import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkDeleteResumes } from "#/resumes";
import {
  type ProblemDetailsDto,
  type BulkDeleteRequestDto,
} from "@/types/api.types";
import { useCurrentUser } from "#/auth";
import { handleApiError } from "@/index";

export function useBulkDeleteResumes() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation<void, ProblemDetailsDto, BulkDeleteRequestDto>({
    mutationFn: bulkDeleteResumes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", user?.id] });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
