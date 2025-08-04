import {
  ApplicationsStatusControlBuildPatch,
  usePatchApplication,
  type ApplicationResponseDto,
} from "#/applications";

export function useUpdateApplicationStatus(
  applicationCard: ApplicationResponseDto,
) {
  const patchApplicationMutation = usePatchApplication();

  const updateApplicationStatus = (newStatus: string) => {
    const patchRequest = ApplicationsStatusControlBuildPatch(
      applicationCard,
      newStatus,
    );
    patchApplicationMutation.mutate({
      id: applicationCard.id,
      patch: patchRequest,
    });
  };

  return {
    isPending: patchApplicationMutation.isPending,
    updateApplicationStatus,
  };
}
