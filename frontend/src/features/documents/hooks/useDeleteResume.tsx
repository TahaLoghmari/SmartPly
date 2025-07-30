import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteResume } from "#/documents";
import { useCurrentUser } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useDeleteResume() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["resumes", user?.id] });
    },
    onError: handleApiError,
  });
}
