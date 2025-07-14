import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ApplicationRequestDto, editApplication } from "#/applications";
import { useCurrentUser } from "#/auth";

export function useEditApplication() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation({
    mutationFn: ({
      id,
      credentials,
    }: {
      id: string;
      credentials: ApplicationRequestDto;
    }) => editApplication(id, credentials),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["application", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["applications", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["applicationStats", user?.id],
      });
    },
  });
}
