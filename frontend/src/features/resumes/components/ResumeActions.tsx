import {
  ResumeViewButton,
  ResumeDeleteButton,
  ResumeDownloadButton,
  type ResumeResponseDto,
} from "#/resumes";

export default function ResumeActions(data: ResumeResponseDto) {
  return (
    <div className="flex items-center justify-start gap-2">
      <ResumeViewButton url={data.url} />
      <ResumeDownloadButton id={data.id} />
      <ResumeDeleteButton resumeId={data.id} />
    </div>
  );
}
