import { ApplicationStatCard, useGetApplicationStats } from "#/applications";
import { Skeleton } from "@/components/ui/skeleton";

const STATUSES = [
  { key: "wishList", label: "WishList", apiKey: "totalWishList" },
  { key: "applied", label: "Applied", apiKey: "totalApplied" },
  { key: "interviewing", label: "Interviewing", apiKey: "totalInterviewing" },
  { key: "offer", label: "Offer", apiKey: "totalOffers" },
  { key: "ghosted", label: "Ghosted", apiKey: "totalGhosted" },
  { key: "rejected", label: "Rejected", apiKey: "totalRejected" },
] as const;

export function ApplicationStats() {
  const { data: applicationStats, isLoading } = useGetApplicationStats();

  return (
    <div className="grid grid-cols-1 gap-4 transition-[width,height,margin,padding] duration-300 md:grid-cols-2 lg:grid-cols-6">
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
        : STATUSES.map(({ key, label, apiKey }) => (
            <ApplicationStatCard
              key={key}
              value={applicationStats?.[apiKey] ?? 0}
              label={label}
            />
          ))}
    </div>
  );
}
