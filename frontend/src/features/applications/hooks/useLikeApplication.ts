import { usePatchApplication } from "#/applications";
import type { JsonPatchDto } from "@/index";

export function useLikeApplication(applicationId: string) {
  const patchApplicationMutation = usePatchApplication();

  const toggleLike = (isLiked: boolean) => {
    const patchRequest: JsonPatchDto[] = [
      {
        op: "replace",
        path: "/isLiked",
        value: !isLiked,
      },
    ];
    patchApplicationMutation.mutate({
      id: applicationId,
      patch: patchRequest,
    });
  };

  return { isPending: patchApplicationMutation.isPending, toggleLike };
}
