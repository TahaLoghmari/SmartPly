import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchApplication, type JsonPatchOp } from "#/applications";
import { useCurrentUser } from "#/auth";

export function usePatchApplication() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: JsonPatchOp[] }) =>
      patchApplication(id, patch),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["application", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["applications", user?.id],
      });
    },
  });
}
