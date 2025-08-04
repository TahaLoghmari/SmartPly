import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  ApplicationPageDocumentsCoverLetters,
  type ApplicationCardProps,
} from "#/applications";
import { SearchBar } from "@/components/SearchBar";
import { X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  CoverLetterDeleteButton,
  CoverLetterPreview,
  useCoverLetterSearchbarStore,
  useGetUserCoverLetter,
} from "#/coverLetters";

export default function ApplicationPageDocumentsCoverLetter({
  applicationCard,
}: ApplicationCardProps) {
  const { search, setSearch } = useCoverLetterSearchbarStore();
  const [isCoverLetterPreviewOpen, setIsCoverLetterPreviewOpen] =
    useState(true);
  const [isChangingCoverLetter, setIsChangingCoverLetter] = useState(false);
  const { data: coverLetter, isLoading } = useGetUserCoverLetter(
    applicationCard.coverLetterId!,
  );

  if (isLoading)
    return (
      <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-6">
        <Spinner className="dark:invert" />
      </div>
    );

  return (
    <>
      {!isChangingCoverLetter ? (
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">{coverLetter?.name}</p>
          <div className="mr-2 flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="text-muted-foreground hover:text-primary flex h-4 w-4 cursor-pointer items-center justify-center"
              onClick={() => setIsChangingCoverLetter((state) => !state)}
            >
              <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
            </svg>
            <CoverLetterDeleteButton coverLetterId={coverLetter!.id} />
          </div>
        </div>
      ) : (
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
              onClick={() => setIsCoverLetterPreviewOpen(false)}
            />
          </div>
          <ApplicationPageDocumentsCoverLetters
            applicationId={applicationCard.id}
            setIsChangingCoverLetter={setIsChangingCoverLetter}
          />
        </div>
      )}

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
    </>
  );
}
