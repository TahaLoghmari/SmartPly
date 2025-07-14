import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApplication } from "#/applications";
import { useCurrentUser } from "#/auth";
import { useNavigate } from "react-router-dom";

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["applications", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      queryClient.invalidateQueries({
        queryKey: ["applicationStats", user?.id],
      });
      navigate("/app/applications");
    },
  });
}
