import { type ApplicationStatCardProps } from "#/applications";

export function ApplicationStatCard({
  value,
  label,
}: ApplicationStatCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-xs">
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
