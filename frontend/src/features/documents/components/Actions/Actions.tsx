import {
  ViewAction,
  DeleteAction,
  type ResumeCreateResponseDto,
} from "#/documents";

export function Actions(data: ResumeCreateResponseDto) {
  return (
    <div className="flex items-center justify-start gap-2">
      <ViewAction url={data.resumeUrl} />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="currentColor"
        className="text-muted-foreground hover:text-primary flex h-[18px] w-[18px] cursor-pointer items-center justify-center"
      >
        <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
      </svg>
      <DeleteAction resumeId={data.id} />
    </div>
  );
}
