import { FileText } from "lucide-react";
import {
  useGetUserResumes,
  ResumeViewButton,
  type ResumeResponseDto,
} from "#/resumes";
import { formatDistanceToNow } from "date-fns";
import {
  useApplicationChangingResumeStore,
  useUpdateApplicationResume,
} from "#/applications";
import { Spinner } from "@/components/ui/spinner";

export default function ApplicationPageDocumentsResumes({
  applicationId,
}: {
  applicationId: string;
}) {
  const { setIsChangingResume } = useApplicationChangingResumeStore();
  const {
    data: resumes,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetUserResumes();

  const { updateApplicationResume, loadingResumeId, isPending } =
    useUpdateApplicationResume(applicationId, () => setIsChangingResume(false));

  if (isError) {
    return (
      <div className="bg-card flex h-40 items-center justify-center rounded-lg border py-4">
        <div className="flex flex-col items-center gap-2">
          <p className="text-muted-foreground text-sm">
            Failed to load resumes.
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

  if (resumes?.length === 0) {
    return (
      <div className="bg-card flex min-h-40 items-center justify-center rounded-lg border py-4">
        <p className="text-muted-foreground text-center text-sm">
          No resumes found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card min-h-40 rounded-lg border py-4">
      {resumes?.map((resume: ResumeResponseDto) => (
        <div
          className="flex min-w-0 flex-col justify-between gap-2 px-6 py-3 sm:flex-row lg:gap-0"
          key={resume.id}
        >
          <div className="flex flex-1 gap-3 lg:items-center">
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
            <ResumeViewButton url={resume.url} />
            <button
              className="text-muted-foreground bg-muted hover:text-strong-muted-foreground flex h-8 w-24 cursor-pointer items-center justify-center rounded-md p-1 text-xs font-medium"
              onClick={() => updateApplicationResume(resume.id)}
              disabled={loadingResumeId === resume.id && isPending}
            >
              {loadingResumeId === resume.id && isPending ? (
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
