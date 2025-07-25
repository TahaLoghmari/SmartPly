import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkDeleteResumes, type BulkDeleteRequestDto } from "#/documents";
import { useCurrentUser } from "#/auth";

export function useBulkDeleteResumes() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation({
    mutationFn: (credentials: BulkDeleteRequestDto) =>
      bulkDeleteResumes(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", user?.id] });
    },
  });
}
