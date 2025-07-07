import { ApplicationStatCard, useApplicationStatsStore } from "#/applications";

export function ApplicationStats() {
  const {
    wishListCount,
    appliedCount,
    interviewingCount,
    offerCount,
    rejectedCount,
    ghostedCount,
  } = useApplicationStatsStore();

  return (
    <div className="grid grid-cols-1 gap-4 transition-all duration-300 md:grid-cols-2 lg:grid-cols-6">
      <ApplicationStatCard value={wishListCount} label="Wish List" />
      <ApplicationStatCard value={appliedCount} label="Applied" />
      <ApplicationStatCard value={interviewingCount} label="Interviewing" />
      <ApplicationStatCard value={offerCount} label="Offers" />
      <ApplicationStatCard value={rejectedCount} label="Rejected" />
      <ApplicationStatCard value={ghostedCount} label="Ghosted" />
    </div>
  );
}
