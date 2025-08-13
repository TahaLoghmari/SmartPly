import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  ResumePreview,
  useResumeSearchbarStore,
  useGetUserResume,
} from "#/resumes";
import {
  ApplicationPageDocumentsResumes,
  ApplicationRemoveResumeButton,
  useApplicationChangingResumeStore,
  type ApplicationCardProps,
} from "#/applications";
import { SearchBar } from "@/components/SearchBar";
import { X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function ApplicationPageDocumentsResume({
  applicationCard,
}: ApplicationCardProps) {
  const { search, setSearch } = useResumeSearchbarStore();
  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(true);
  const { isChangingResume, setIsChangingResume } =
    useApplicationChangingResumeStore();
  const {
    data: resume,
    isLoading,
    isError,
    refetch,
  } = useGetUserResume(applicationCard.resumeId ?? undefined);

  if (isLoading)
    return (
      <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-6">
        <Spinner />
      </div>
    );
  if (isError)
    return (
      <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-3">
        <span className="text-muted-foreground text-sm">
          Failed to load resume.
        </span>
        <button
          className="bg-muted hover:bg-muted/80 rounded px-3 py-1 text-xs font-medium"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  return (
    <>
      {/* this is hidden when resumeId is null */}
      {!isChangingResume && applicationCard.resumeId && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">{resume?.name}</p>
          <div className="mr-2 flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="text-muted-foreground hover:text-primary flex h-4 w-4 cursor-pointer items-center justify-center"
              onClick={() => setIsChangingResume(true)}
            >
              <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
            </svg>
            {/* this is not for deleting resume but rather unlinking the resume with current application */}
            <ApplicationRemoveResumeButton
              resumeId={resume!.id}
              applicationId={applicationCard.id}
            />
          </div>
        </div>
      )}

      {isChangingResume && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name"
              className="w-full"
            />
            <X
              className="text-muted-foreground hover:text-strong-muted-foreground h-[18px] w-[18px] cursor-pointer"
              onClick={() => setIsChangingResume(false)}
            />
          </div>
          <ApplicationPageDocumentsResumes applicationId={applicationCard.id} />
        </div>
      )}

      {/* this is hidden when resumeId is null */}
      {applicationCard.resumeId && (
        <div
          className={`bg-card flex w-full ${isResumePreviewOpen && "min-h-screen flex-1"} flex-col rounded-lg border`}
        >
          <div
            className="flex w-full cursor-pointer items-center justify-between p-4"
            onClick={() => setIsResumePreviewOpen((state) => !state)}
          >
            <p className="text-strong-muted-foreground text-sm">
              Resume Preview
            </p>
            {isResumePreviewOpen ? (
              <ChevronUp className="h-5 w-5 cursor-pointer" />
            ) : (
              <ChevronDown className="h-5 w-5 cursor-pointer" />
            )}
          </div>
          {isResumePreviewOpen && <ResumePreview url={resume!.url} />}
        </div>
      )}
    </>
  );
}
