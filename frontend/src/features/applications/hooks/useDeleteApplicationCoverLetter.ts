import { usePatchApplication } from "#/applications";
import type { JsonPatchDto } from "@/index";

export function useDeleteApplicationCoverLetter(
  applicationId: string,
  onSuccess?: () => void,
) {
  const patchApplicationMutation = usePatchApplication();

  const DeleteApplicationCoverLetter = (coverLetterId: string) => {
    const patchRequest: JsonPatchDto[] = [
      { op: "remove", path: "/coverLetterId", value: coverLetterId },
    ];
    patchApplicationMutation.mutate(
      { id: applicationId, patch: patchRequest },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return {
    DeleteApplicationCoverLetter,
    isPending: patchApplicationMutation.isPending,
  };
}
