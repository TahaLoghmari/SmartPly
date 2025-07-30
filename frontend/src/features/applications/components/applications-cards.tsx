import {
  ApplicationsCard,
  ApplicationsManageJobs,
  useGetUserApplications,
  type ApplicationResponseDto,
} from "#/applications";
import { Spinner } from "@/components/ui/spinner";
import { Plus } from "lucide-react";
import { ApplicationsButtonAdd } from "#/applications";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export function ApplicationsCards() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserApplications();
    
  const { ref, inView } = useInView({ rootMargin: "200px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  if (allItems.length > 0)
    return (
      <>
        <ApplicationsManageJobs />
        <div className="grid grid-cols-1 gap-6">
          {allItems.map((applicationCard: ApplicationResponseDto) => (
            <ApplicationsCard
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
    <div className="text-muted-foreground mt-26 flex w-full flex-1 flex-col items-center justify-center gap-4">
      <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
        <Plus className="h-8 w-8" />
      </div>
      <p className="text-lg font-medium">No Applications yet</p>
      <p className="text-sm">
        Get started by adding your first job application
      </p>
      <ApplicationsButtonAdd />
    </div>
  );
}
