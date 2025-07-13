import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ApplicationRequestDto, editApplication } from "#/applications";
import { useCurrentUser } from "#/auth";

export function useEditApplication({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation({
    mutationFn: (credentials: ApplicationRequestDto) =>
      editApplication(id, credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      queryClient.invalidateQueries({
        queryKey: ["applications", user?.id],
      });
    },
  });
}
