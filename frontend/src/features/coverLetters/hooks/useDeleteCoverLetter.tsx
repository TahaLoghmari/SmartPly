import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCoverLetter } from "#/coverLetters";
import { useCurrentUser } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useDeleteCoverLetter() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: deleteCoverLetter,
    onSuccess: (_, id) => {
      queryClient.refetchQueries({ queryKey: ["coverLetters", user?.id] });
      queryClient.removeQueries({ queryKey: ["coverLetter", id] });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
