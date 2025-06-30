import { useApplicationsAppliedCountStore } from "#/applications";

export function ApplicationsHeaderAppliedCard() {
  const { appliedCount } = useApplicationsAppliedCountStore();
  return (
    <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-xs">
      <div className="text-2xl font-bold">{appliedCount}</div>
      <p className="text-muted-foreground text-sm">Applied</p>
    </div>
  );
}
