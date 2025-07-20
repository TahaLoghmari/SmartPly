import {
  ViewAction,
  DeleteAction,
  DownloadAction,
  type ResumeResponseDto,
} from "#/documents";

export function Actions(data: ResumeResponseDto) {
  return (
    <div className="flex items-center justify-start gap-2">
      <ViewAction url={data.resumeUrl} />
      <DownloadAction id={data.id} />
      <DeleteAction resumeId={data.id} />
    </div>
  );
}
