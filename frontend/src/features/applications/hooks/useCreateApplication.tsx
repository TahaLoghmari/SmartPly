import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ApplicationCreateRequestDto,
  applicationApi,
} from "#/applications";
import { useCurrentUser } from "#/auth";

export function useCreateApplication() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: ApplicationCreateRequestDto) =>
      applicationApi.createApplication(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", user?.id] });
    },
  });
}
