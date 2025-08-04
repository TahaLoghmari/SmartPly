import { usePatchApplication } from "#/applications";
import type { JsonPatchDto } from "@/index";
import { useState } from "react";

export function useUpdateApplicationCoverLetter(
  applicationId: string,
  onSuccess?: () => void,
) {
  const patchApplicationMutation = usePatchApplication();
  const [loadingCoverLetterId, setLoadingCoverLetterId] = useState<
    string | null
  >(null);

  const updateApplicationCoverLetter = (coverLetterId: string) => {
    setLoadingCoverLetterId(coverLetterId);
    const patchRequest: JsonPatchDto[] = [
      { op: "replace", path: "/coverLetterId", value: coverLetterId },
    ];
    patchApplicationMutation.mutate(
      { id: applicationId, patch: patchRequest },
      {
        onSuccess: () => {
          onSuccess?.();
          setLoadingCoverLetterId(null);
        },
        onError: () => {
          setLoadingCoverLetterId(null);
        },
      },
    );
  };

  return {
    updateApplicationCoverLetter,
    loadingCoverLetterId,
    isPending: patchApplicationMutation.isPending,
  };
}
