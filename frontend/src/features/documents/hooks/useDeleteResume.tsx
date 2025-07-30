import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteResume } from "#/documents";
import { useCurrentUser } from "#/auth";
import { handleApiError } from "@/index";

export function useDeleteResume() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation({
    mutationFn: (id: string) => deleteResume(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["resumes", user?.id] });
    },
    onError: handleApiError,
  });
}
