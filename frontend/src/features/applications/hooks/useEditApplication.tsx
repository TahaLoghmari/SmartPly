import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ApplicationRequestDto, editApplication } from "#/applications";

export function useEditApplication({ id }: { id: string }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: ApplicationRequestDto) =>
      editApplication(id, credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
    },
  });
}
