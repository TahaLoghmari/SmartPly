import {
  usePatchApplication,
  type ApplicationResponseDto,
} from "#/applications";
import { Spinner } from "@/components/ui/spinner";
import { type JsonPatchOp } from "@/types";

export function ApplicationsButtonLike({
  applicationCard,
}: {
  applicationCard: ApplicationResponseDto;
}) {

  const patchApplicationMutation = usePatchApplication();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const patchRequest: JsonPatchOp[] = [
      {
        op: "replace",
        path: "/isLiked",
        value: !applicationCard.isLiked,
      },
    ];
    patchApplicationMutation.mutate({
      id: applicationCard.id,
      patch: patchRequest,
    });
  };
  
  return patchApplicationMutation.isPending ? (
    <Spinner className="h-auto w-6 invert" />
  ) : (
    <button
      onClick={handleClick}
      className={`${!applicationCard.isLiked ? "text-muted-foreground" : "text-primary"} hover:ring-ring/50 hover:border-ring text-muted-foreground hover:text-primary flex w-6 cursor-pointer items-center justify-center rounded p-1 transition-colors duration-200 hover:border hover:ring-[2px]`}
    >
      {!applicationCard.isLiked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
        </svg>
      )}
    </button>
  );
}
