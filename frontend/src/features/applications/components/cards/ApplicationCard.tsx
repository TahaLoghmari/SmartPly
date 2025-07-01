import {
  type ApplicationCardProps,
  TechnologiesUsed,
  ViewApplicationButton,
  EditApplicationButton,
  ApplicationStatusToColor,
} from "#/applications";
import { MapPin, DollarSign, Building } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ApplicationCard({ applicationCard }: ApplicationCardProps) {
  return (
    <div className="bg-card hover:bg-accent text-card-foreground flex cursor-pointer flex-col gap-3 rounded-lg border p-6 shadow-xs transition-all">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <p className="tracking-light text-lg font-semibold">
            {applicationCard.position}
          </p>
          <p className="flex items-center gap-2">
            <Building className="text-muted-foreground h-4 w-4" />
            <p className="font-medium">{applicationCard.companyName}</p>
          </p>
          <p className="text-muted-foreground text-xs">
            {applicationCard.companyEmail}
          </p>
        </div>
        <div>
          <p
            className={`inline-flex ${ApplicationStatusToColor[applicationCard.status]} items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-all`}
          >
            {applicationCard.status}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-1">
          <MapPin className="text-muted-foreground h-3 w-3" />
          <p>{applicationCard.location}</p>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="text-muted-foreground h-3 w-3" />
          <p>
            {applicationCard.startSalary}k-{applicationCard.endSalary}k
          </p>
        </div>
        <div className="text-foreground flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all">
          {applicationCard.type}
        </div>
        <div className="text-foreground flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all">
          {applicationCard.level}
        </div>
        <div className="text-foreground flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all">
          {applicationCard.jobType}
        </div>
      </div>

      <TechnologiesUsed technologies={applicationCard.technologiesUsed} />

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Applied:</p>
          <p className="text-xs">
            {applicationCard.createdAt
              .toLocaleDateString("en-GB")
              .replace(/\//g, "-")}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Last Update:</p>
          <p className="text-xs">
            {formatDistanceToNow(applicationCard.updatedAt, {
              addSuffix: true,
            })}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Deadline:</p>
          <p className="text-xs">
            {applicationCard.deadline
              .toLocaleDateString("en-GB")
              .replace(/\//g, "-")}
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-muted-foreground text-sm">Notes</p>
        <p className="line-clamp-2 text-xs">{applicationCard.notes}</p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-2">
          <ViewApplicationButton />
          <EditApplicationButton />
        </div>
      </div>
    </div>
  );
}
