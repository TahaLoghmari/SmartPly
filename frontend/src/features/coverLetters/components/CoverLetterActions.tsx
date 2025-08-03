import {
  CoverLetterViewButton,
  CoverLetterDeleteButton,
  CoverLetterDownloadButton,
  type CoverLetterResponseDto,
} from "#/coverLetters";

export default function CoverLetterActions(data: CoverLetterResponseDto) {
  return (
    <div className="flex items-center justify-start gap-2">
      <CoverLetterViewButton url={data.url} />
      <CoverLetterDownloadButton id={data.id} />
      <CoverLetterDeleteButton coverLetterId={data.id} />
    </div>
  );
}
