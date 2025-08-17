import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "#/settings";
import { handleApiError, type ProblemDetailsDto } from "@/index";
import type { UserRequestDto } from "#/settings";

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, UserRequestDto>({
    mutationFn: updateCurrentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
