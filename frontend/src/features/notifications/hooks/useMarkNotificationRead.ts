import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";
import { markNotificationRead } from "#/notifications";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
