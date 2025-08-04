import { usePatchApplication } from "#/applications";
import type { JsonPatchDto } from "@/index";
import { useState } from "react";

export function useUpdateApplicationResume(
  applicationId: string,
  onSuccess?: () => void,
) {
  const patchApplicationMutation = usePatchApplication();
  const [loadingResumeId, setLoadingResumeId] = useState<string | null>(null);

  const updateApplicationResume = (resumeId: string) => {
    setLoadingResumeId(resumeId);
    const patchRequest: JsonPatchDto[] = [
      { op: "replace", path: "/resumeId", value: resumeId },
    ];
    patchApplicationMutation.mutate(
      { id: applicationId, patch: patchRequest },
      {
        onSuccess: () => {
          onSuccess?.();
          setLoadingResumeId(null);
        },
        onError: () => {
          setLoadingResumeId(null);
        },
      },
    );
  };

  return {
    updateApplicationResume,
    loadingResumeId,
    isPending: patchApplicationMutation.isPending,
  };
}
