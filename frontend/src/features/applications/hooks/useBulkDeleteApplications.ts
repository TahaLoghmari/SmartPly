import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkdDeleteApplication } from "#/applications";
import { useCurrentUser } from "#/auth";
import { useNavigate } from "react-router-dom";
import type { BulkDeleteRequestDto } from "@/types/api.types";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useBulkDeleteApplications() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();
  return useMutation<void, ProblemDetailsDto, BulkDeleteRequestDto>({
    mutationFn: bulkdDeleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", user?.id] });
      navigate("/app/applications");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
