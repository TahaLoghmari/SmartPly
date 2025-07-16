import {
  ApplicationCard,
  useGetUserApplications,
  type ApplicationResponseDto,
} from "#/applications";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddApplicationButton } from "#/dashboard";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export function ApplicationCards() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserApplications();
  const { ref, inView } = useInView({ rootMargin: "200px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <Spinner className="dark:invert" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-muted-foreground flex w-full flex-1 flex-col items-center justify-center gap-7">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-primary text-4xl font-medium">An Error Occured</p>
          <p className="text-sm">Please refresh the page</p>
        </div>
        <Button>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  if (allItems.length > 0)
    return (
      <>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
            <Spinner className="dark:invert" />
          </div>
        )}
        {hasNextPage && <div ref={ref} style={{ height: 40 }} />}
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
      <AddApplicationButton />
    </div>
  );
}
