import {
  ResumeViewButton,
  ResumeDeleteButton,
  ResumeDownloadButton,
  type ResumeResponseDto,
} from "#/documents";

export default function Actions(data: ResumeResponseDto) {
  return (
    <div className="flex items-center justify-start gap-2">
      <ResumeViewButton url={data.resumeUrl} />
      <ResumeDownloadButton id={data.id} />
      <ResumeDeleteButton resumeId={data.id} />
    </div>
  );
}
