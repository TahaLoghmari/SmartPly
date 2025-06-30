import { useApplicationsRejectedCountStore } from "#/applications";

export function ApplicationsHeaderRejectedCard() {
  const { rejectedCount } = useApplicationsRejectedCountStore();
  return (
    <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-xs">
      <div className="text-2xl font-bold">{rejectedCount}</div>
      <p className="text-muted-foreground text-sm">Rejected</p>
    </div>
  );
}
