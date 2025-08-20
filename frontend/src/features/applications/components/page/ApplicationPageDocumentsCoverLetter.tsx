import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  ApplicationPageDocumentsCoverLetters,
  ApplicationRemoveCoverLetterButton,
  useApplicationChangingCoverLetterStore,
  type ApplicationCardProps,
} from "#/applications";
import { SearchBar } from "@/components/SearchBar";
import { X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  CoverLetterPreview,
  useCoverLetterSearchbarStore,
  useGetUserCoverLetter,
} from "#/coverLetters";

export default function ApplicationPageCoverLetter({
  applicationCard,
}: ApplicationCardProps) {
  const { search, setSearch } = useCoverLetterSearchbarStore();
  const [isCoverLetterPreviewOpen, setIsCoverLetterPreviewOpen] =
    useState(true);
  const { isChangingCoverLetter, setIsChangingCoverLetter } =
    useApplicationChangingCoverLetterStore();
  const {
    data: coverLetter,
    isLoading,
    isError,
    refetch,
  } = useGetUserCoverLetter(applicationCard.coverLetterId ?? undefined);

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
          Failed to load cover letter.
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
      {/* this is hidden when coverLetterId is null */}
      {!isChangingCoverLetter && applicationCard.coverLetterId && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">{coverLetter?.name}</p>
          <div className="mr-2 flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="text-muted-foreground hover:text-primary flex h-4 w-4 cursor-pointer items-center justify-center"
              onClick={() => setIsChangingCoverLetter(true)}
            >
              <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
            </svg>
            {/* this is not for deleting cover letter but rather unlinking the cover letter with current application */}
            <ApplicationRemoveCoverLetterButton
              coverLetterId={coverLetter!.id}
              applicationId={applicationCard.id}
            />
          </div>
        </div>
      )}

      {isChangingCoverLetter && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name"
              className="w-full"
            />
            <X
              className="text-muted-foreground hover:text-strong-muted-foreground h-[18px] w-[18px] shrink-0 cursor-pointer"
              onClick={() => setIsChangingCoverLetter(false)}
            />
          </div>
          <ApplicationPageDocumentsCoverLetters
            applicationId={applicationCard.id}
          />
        </div>
      )}

      {/* this is hidden when coverLetterId is null */}
      {applicationCard.coverLetterId && (
        <div
          className={`bg-card flex w-full ${isCoverLetterPreviewOpen && "min-h-screen flex-1"} flex-col rounded-lg border`}
        >
          <div
            className="flex w-full cursor-pointer items-center justify-between p-4"
            onClick={() => setIsCoverLetterPreviewOpen((state) => !state)}
          >
            <p className="text-strong-muted-foreground text-sm">
              Cover Letter Preview
            </p>
            {isCoverLetterPreviewOpen ? (
              <ChevronUp className="h-5 w-5 cursor-pointer" />
            ) : (
              <ChevronDown className="h-5 w-5 cursor-pointer" />
            )}
          </div>
          {isCoverLetterPreviewOpen && (
            <CoverLetterPreview url={coverLetter!.url} />
          )}
        </div>
      )}
    </>
  );
}
