import { ApplicationStatCard, useGetUserApplications } from "#/applications";
import { Skeleton } from "@/components/ui/skeleton";

const STATUSES = [
  { key: "wishList", label: "WishList" },
  { key: "applied", label: "Applied" },
  { key: "interviewing", label: "Interviewing" },
  { key: "offer", label: "Offer" },
  { key: "ghosted", label: "Ghosted" },
  { key: "rejected", label: "Rejected" },
] as const;

export function ApplicationStats() {
  const { data: applicationCardsState = [], isLoading } =
    useGetUserApplications();

  const statusCounts = STATUSES.reduce(
    (acc, { key }) => {
      acc[key] = applicationCardsState.filter((a) => a.status === key).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="grid grid-cols-1 gap-4 transition-all duration-300 md:grid-cols-2 lg:grid-cols-6">
      {isLoading
        ? STATUSES.map(({ key }) => (
            <div
              key={key}
              className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4 shadow-xs"
            >
              <div>
                <Skeleton className="mb-2 h-7 w-7" />
                <Skeleton className="h-4 w-25" />
              </div>
            </div>
          ))
        : STATUSES.map(({ key, label }) => (
            <ApplicationStatCard
              key={key}
              value={statusCounts[key]}
              label={label}
            />
          ))}
    </div>
  );
}
