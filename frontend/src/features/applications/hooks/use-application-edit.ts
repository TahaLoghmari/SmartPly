import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ApplicationRequestDto, editApplication } from "#/applications";
import { useCurrentUser } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export interface EditApplicationMutationProps {
  id: string;
  credentials: ApplicationRequestDto;
}

export function useEditApplication() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation<void, ProblemDetailsDto, EditApplicationMutationProps>({
    mutationFn: ({ id, credentials }: EditApplicationMutationProps) =>
      editApplication(id, credentials),
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
