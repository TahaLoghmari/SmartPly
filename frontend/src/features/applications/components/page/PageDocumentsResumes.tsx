import { FileText } from "lucide-react";
import { useGetUserResumes, ViewAction } from "#/documents";
import { formatDistanceToNow } from "date-fns";
import { usePatchApplication } from "#/applications";
import type { JsonPatchDto } from "@/index";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export default function PageDocumentsResumes({
  applicationId,
  setIsChangingResume,
}: {
  applicationId: string;
  setIsChangingResume: (state: boolean) => void;
}) {
  const { data: resumesList, isLoading } = useGetUserResumes();
  const patchApplicationMutation = usePatchApplication();
  const [loadingResumeId, setLoadingResumeId] = useState<string | null>(null);

  const updateApplicationResume = (id: string) => {
    setLoadingResumeId(id);
    const patchRequest: JsonPatchDto[] = [
      {
        op: "replace",
        path: "/resumeId",
        value: id,
      },
    ];
    patchApplicationMutation.mutate(
      {
        id: applicationId,
        patch: patchRequest,
      },
      {
        onSuccess: () => {
          setIsChangingResume(false);
          setLoadingResumeId(null);
        },
        onError: () => {
          setLoadingResumeId(null);
        },
      },
    );
  };

  if (isLoading)
    return (
      <div className="bg-card flex h-40 items-center justify-center rounded-lg border py-4">
        <Spinner className="size-40 dark:invert" />
      </div>
    );
  return (
    <div className="bg-card min-h-40 rounded-lg border py-4">
      {resumesList?.map((resume, index) => (
        <div className="flex min-w-0 justify-between px-6 py-3" key={index}>
          <div className="flex flex-1 items-center gap-3">
            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
              <FileText className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="flex-1 gap-1 text-sm">
              <p className="font-bold">{resume.name}</p>
              <div className="flex items-center gap-2 text-xs font-bold">
                <div className="text-muted-foreground bg-muted rounded px-1 py-0.5">
                  PDF
                </div>
                <p className="text-muted-foreground text-xs">
                  Last Edited:{" "}
                  {formatDistanceToNow(resume.updatedAt!, {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ViewAction url={resume.resumeUrl} />
            <button
              className="text-muted-foreground bg-muted hover:text-strong-muted-foreground flex h-8 w-24 cursor-pointer items-center justify-center rounded-md p-1 text-xs font-medium"
              onClick={() => updateApplicationResume(resume.id)}
              disabled={
                loadingResumeId === resume.id &&
                patchApplicationMutation.isPending
              }
            >
              {loadingResumeId === resume.id &&
              patchApplicationMutation.isPending ? (
                <Spinner className="h-10 w-10" />
              ) : (
                <span className="cursor-pointer">Select</span>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
