import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ApplicationCreateRequestDto,
  applicationApi,
} from "#/applications";

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: ApplicationCreateRequestDto) =>
      applicationApi.createApplication(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
