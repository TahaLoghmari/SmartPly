import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ApplicationRequestDto,
  type ApplicationResponseDto,
  createApplication,
} from "#/applications";
import { useCurrentUser } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useCreateApplication() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  return useMutation<
    ApplicationResponseDto,
    ProblemDetailsDto,
    ApplicationRequestDto
  >({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications", user?.id],
      });
    },
    onError: handleApiError,
  });
}
