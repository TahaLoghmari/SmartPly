import { FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import {
  useApplicationChangingCoverLetterStore,
  useUpdateApplicationCoverLetter,
} from "#/applications";
import {
  CoverLetterViewButton,
  useGetUserCoverLetters,
  type CoverLetterResponseDto,
} from "#/coverLetters";

export default function ApplicationPageDocumentsCoverLetters({
  applicationId,
}: {
  applicationId: string;
}) {
  const { setIsChangingCoverLetter } = useApplicationChangingCoverLetterStore();
  const {
    data: coverLetters,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetUserCoverLetters();

  const { updateApplicationCoverLetter, loadingCoverLetterId, isPending } =
    useUpdateApplicationCoverLetter(applicationId, () =>
      setIsChangingCoverLetter(false),
    );

  if (isError) {
    return (
      <div className="bg-card flex h-40 items-center justify-center rounded-lg border py-4">
        <div className="flex flex-col items-center gap-2">
          <p className="text-muted-foreground text-sm">
            Failed to load cover letters.
          </p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-muted hover:bg-muted/80 rounded px-3 py-1 text-xs font-medium"
          >
            {isFetching ? "Retrying..." : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="bg-card flex h-40 items-center justify-center rounded-lg border py-4">
        <Spinner />
      </div>
    );

  if (coverLetters?.length === 0) {
    return (
      <div className="bg-card flex min-h-40 items-center justify-center rounded-lg border py-4">
        <p className="text-muted-foreground text-center text-sm">
          No cover letters found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card min-h-40 rounded-lg border py-4">
      {coverLetters?.map((coverLetter: CoverLetterResponseDto) => (
        <div
          className="flex min-w-0 flex-col justify-between gap-2 px-6 py-3 sm:flex-row lg:gap-0"
          key={coverLetter.id}
        >
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
              disabled={loadingCoverLetterId === coverLetter.id && isPending}
            >
              {loadingCoverLetterId === coverLetter.id && isPending ? (
                <Spinner className="h-4 w-4 border-2" />
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
