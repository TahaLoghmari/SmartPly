import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  editApplication,
  type ApplicationEditRequestDto,
} from "#/applications";
import { useCurrentUser } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useEditApplication() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation<void, ProblemDetailsDto, ApplicationEditRequestDto>({
    mutationFn: editApplication,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["application", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["applications", user?.id],
      });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
