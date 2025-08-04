import { FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { usePatchApplication } from "#/applications";
import type { JsonPatchDto } from "@/index";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import {
  CoverLetterViewButton,
  useGetUserCoverLetters,
  type CoverLetterResponseDto,
} from "#/coverLetters";

export default function ApplicationPageDocumentsCoverLetters({
  applicationId,
  setIsChangingCoverLetter,
}: {
  applicationId: string;
  setIsChangingCoverLetter: (state: boolean) => void;
}) {
  const { data: coverLetters, isLoading } = useGetUserCoverLetters();
  const patchApplicationMutation = usePatchApplication();
  const [loadingCoverLetterId, setLoadingCoverLetterId] = useState<
    string | null
  >(null);

  const updateApplicationCoverLetter = (id: string) => {
    setLoadingCoverLetterId(id);
    const patchRequest: JsonPatchDto[] = [
      {
        op: "replace",
        path: "/coverLetterId",
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
          setIsChangingCoverLetter(false);
          setLoadingCoverLetterId(null);
        },
        onError: () => {
          setLoadingCoverLetterId(null);
        },
      },
    );
  };

  if (isLoading)
    return (
      <div className="bg-card flex h-40 items-center justify-center rounded-lg border py-4">
        <Spinner className="dark:invert" />
      </div>
    );
  return (
    <div className="bg-card min-h-40 rounded-lg border py-4">
      {coverLetters?.map(
        (coverLetter: CoverLetterResponseDto, index: number) => (
          <div className="flex min-w-0 justify-between px-6 py-3" key={index}>
            <div className="flex flex-1 items-center gap-3">
              <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                <FileText className="text-muted-foreground h-4 w-4" />
              </div>
              <div className="flex-1 gap-1 text-sm">
                <p className="font-bold">{coverLetter.name}</p>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <div className="text-muted-foreground bg-muted rounded px-1 py-0.5">
                    PDF
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Last Edited:{" "}
                    {formatDistanceToNow(coverLetter.updatedAt!, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CoverLetterViewButton url={coverLetter.url} />
              <button
                className="text-muted-foreground bg-muted hover:text-strong-muted-foreground flex h-8 w-24 cursor-pointer items-center justify-center rounded-md p-1 text-xs font-medium"
                onClick={() => updateApplicationCoverLetter(coverLetter.id)}
                disabled={
                  loadingCoverLetterId === coverLetter.id &&
                  patchApplicationMutation.isPending
                }
              >
                {loadingCoverLetterId === coverLetter.id &&
                patchApplicationMutation.isPending ? (
                  <Spinner className="h-4 w-4 border-2" />
                ) : (
                  <span className="cursor-pointer">Select</span>
                )}
              </button>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
