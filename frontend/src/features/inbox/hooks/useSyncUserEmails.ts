import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleApiError, type ProblemDetailsDto } from "@/index";
import { syncUserEmails } from "#/inbox";
import { useCurrentUser } from "#/auth";

export function useSyncUserEmails() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, void>({
    mutationFn: syncUserEmails,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["emails", user?.id],
      });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
