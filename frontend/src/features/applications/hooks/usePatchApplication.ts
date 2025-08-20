import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  patchApplication,
  type ApplicationPatchRequestDto,
} from "#/applications";
import { useCurrentUser } from "#/auth";
import { type ProblemDetailsDto } from "@/types/api.types";
import { handleApiError } from "@/index";

export function usePatchApplication() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation<void, ProblemDetailsDto, ApplicationPatchRequestDto>({
    mutationFn: patchApplication,
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
