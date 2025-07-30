import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchApplication } from "#/applications";
import { useCurrentUser } from "#/auth";
import { type ProblemDetailsDto, type JsonPatchDto } from "@/types";
import { handleApiError } from "@/index";

export interface PatchApplicationMutationProps {
  id: string;
  patch: JsonPatchDto[];
}

export function usePatchApplication() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation<void, ProblemDetailsDto, PatchApplicationMutationProps>({
    mutationFn: ({ id, patch }: PatchApplicationMutationProps) =>
      patchApplication(id, patch),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["application", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["applications", user?.id],
      });
    },
    onError: handleApiError,
  });
}
