import { useApplicationsGhostedCountStore } from "#/applications";

export function ApplicationsHeaderGhostedCard() {
  const { ghostedCount } = useApplicationsGhostedCountStore();
  return (
    <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-xs">
      <div className="text-2xl font-bold">{ghostedCount}</div>
      <p className="text-muted-foreground text-sm">Ghosted</p>
    </div>
  );
}
