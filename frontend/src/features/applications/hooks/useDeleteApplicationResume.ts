import { usePatchApplication } from "#/applications";
import type { JsonPatchDto } from "@/index";

export function useDeleteApplicationResume(
  applicationId: string,
  onSuccess?: () => void,
) {
  const patchApplicationMutation = usePatchApplication();

  const DeleteApplicationResume = (resumeId: string) => {
    const patchRequest: JsonPatchDto[] = [
      { op: "remove", path: "/resumeId", value: resumeId },
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
    DeleteApplicationResume,
    isPending: patchApplicationMutation.isPending,
  };
}
