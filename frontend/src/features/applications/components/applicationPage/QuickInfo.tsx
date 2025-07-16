import {
  type ApplicationPageProps,
  ApplicationStatusToColor,
  applicationsStatusOptionsConstant,
  type ApplicationStatusLabel,
} from "#/applications";
import { formatDistanceToNow } from "date-fns";

export function QuickInfo({ applicationCard }: ApplicationPageProps) {
  const status: ApplicationStatusLabel = applicationsStatusOptionsConstant.find(
    (a) => a.value === applicationCard.status,
  )!.label;
  return (
    <div className="bg-card text-card-foreground flex min-w-70 flex-col gap-5 rounded-lg border p-6">
      <p className="text-2xl leading-none font-semibold tracking-tight">
        Quick Info
      </p>
      <div className="border-muted-foreground flex flex-col gap-3 border-t pt-2">
        <div className="flex items-center justify-between gap-2 text-xs">
          <p>Applied:</p>
          <span className="text-muted-foreground">
            {applicationCard.createdAt &&
              applicationCard.createdAt
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs">
          <p>Last Update:</p>
          <span className="text-muted-foreground">
            {applicationCard.updatedAt &&
              formatDistanceToNow(applicationCard.updatedAt, {
                addSuffix: true,
              })}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs">
          <p>Deadline:</p>
          <span className="text-muted-foreground">
            {applicationCard.deadline &&
              applicationCard.deadline
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs">
          <p>Stats:</p>
          <p
            className={`inline-flex ${ApplicationStatusToColor[status]} items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-[width,height,margin,padding] duration-300`}
          >
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}
