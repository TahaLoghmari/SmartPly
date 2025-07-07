import {
  type ApplicationStatCardProps,
  ApplicationStatusToIcon,
} from "#/applications";

export function ApplicationStatCard({
  value,
  label,
}: ApplicationStatCardProps) {
  const {
    icon: Icon,
    className,
    divClassName,
  } = ApplicationStatusToIcon[label];
  return (
    <div className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4 shadow-xs">
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
      <div className={divClassName}>
        <Icon className={className} />
      </div>
    </div>
  );
}
