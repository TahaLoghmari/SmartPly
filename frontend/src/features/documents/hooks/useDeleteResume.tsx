import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteResume } from "#/documents";
import { useCurrentUser } from "#/auth";

export function useDeleteResume() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation({
    mutationFn: (id: string) => deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", user?.id] });
    },
  });
}
