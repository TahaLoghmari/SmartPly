import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ApplicationCreateRequestDto,
  createApplication,
} from "#/applications";
import { useCurrentUser } from "#/auth";

export function useCreateApplication() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: ApplicationCreateRequestDto) =>
      createApplication(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", user?.id] });
    },
  });
}
