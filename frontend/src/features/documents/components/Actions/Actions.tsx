import {
  ViewAction,
  DeleteAction,
  DownloadAction,
  type ResumeCreateResponseDto,
} from "#/documents";

export function Actions(data: ResumeCreateResponseDto) {
  return (
    <div className="flex items-center justify-start gap-2">
      <ViewAction url={data.resumeUrl} />
      <DownloadAction id={data.id} />
      <DeleteAction resumeId={data.id} />
    </div>
  );
}
