import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ApplicationRequestDto, createApplication } from "#/applications";
import { useCurrentUser } from "#/auth";

export function useCreateApplication() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: ApplicationRequestDto) =>
      createApplication(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["applicationStats", user?.id],
      });
    },
  });
}
