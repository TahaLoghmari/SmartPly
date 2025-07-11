import {
  type ApplicationStatCardProps,
} from "#/applications";

export function ApplicationStatCard({
  value,
  label,
}: ApplicationStatCardProps) {
  return (
    <div className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4 shadow-xs">
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
    </div>
  );
}
