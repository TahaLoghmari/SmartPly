import {
  ApplicationCard,
  ApplicationsManageJobs,
  useGetUserApplications,
  type ApplicationResponseDto,
} from "#/applications";
import { Spinner } from "@/components/ui/spinner";
import { Plus } from "lucide-react";
import { ApplicationAddButton } from "#/applications";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";

export default function ApplicationsCards() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
  } = useGetUserApplications();

  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  if (allItems.length === 0 && isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
        <span className="text-muted-foreground text-lg">
          Failed to load applications.
        </span>
        <Button onClick={() => fetchNextPage()} className="cursor-pointer">
          {isPending ? (
            <Spinner className="h-6 w-6 border-2 invert" />
          ) : (
            "Retry"
          )}
        </Button>
      </div>
    );
  }

  if (allItems.length > 0)
    return (
      <>
        <ApplicationsManageJobs />
        <div className="grid grid-cols-1 gap-6">
          {allItems.map((applicationCard: ApplicationResponseDto) => (
            <ApplicationCard
              applicationCard={applicationCard}
              key={applicationCard.id}
            />
          ))}
        </div>
        {/* When you call fetchNextPage(), TanStack Query will call your function again with the next pageParam. */}
        {isFetchingNextPage && (
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            <Spinner />
          </div>
        )}
        {isError && (
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-2">
            <span className="text-muted-foreground text-sm">
              Failed to load more applications.
            </span>
            <Button className="cursor-pointer" onClick={() => fetchNextPage}>
              {isFetchingNextPage ? (
                <Spinner className="h-6 w-6 border-2 invert" />
              ) : (
                "Retry"
              )}
            </Button>
          </div>
        )}
        {hasNextPage && !isError && <div ref={ref} />}
      </>
    );

  return (
    <div className="text-muted-foreground flex w-full flex-1 flex-col items-center justify-center gap-4">
      <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
        <Plus className="h-8 w-8" />
      </div>
      <p className="text-lg font-medium">No Applications yet</p>
      <p className="text-sm">
        Get started by adding your first job application
      </p>
      <ApplicationAddButton />
    </div>
  );
}
