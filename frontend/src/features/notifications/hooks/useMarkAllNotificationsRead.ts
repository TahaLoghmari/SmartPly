import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";
import { markAllNotificationsRead } from "#/notifications";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation<void, ProblemDetailsDto, void>({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
