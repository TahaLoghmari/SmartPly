import {
  type ApplicationCardProps,
  TechnologiesUsed,
  ViewApplicationButton,
  EditApplicationButton,
  ApplicationStatusToColor,
  applicationsStatusOptionsConstant,
  applicationsTypeOptionsConstant,
  applicationsJobTypeOptionsConstant,
  applicationsLevelOptionsConstant,
  type ApplicationStatusLabel,
  type ApplicationTypeLabel,
  type ApplicationJobTypeLabel,
  type ApplicationLevelLabel,
} from "#/applications";
import {
  MapPin,
  DollarSign,
  Building,
  Calendar,
  Clock,
  CalendarClock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ApplicationCard({ applicationCard }: ApplicationCardProps) {
  const status: ApplicationStatusLabel = applicationsStatusOptionsConstant.find(
    (a) => a.value === applicationCard.status,
  )!.label;
  const type: ApplicationTypeLabel = applicationsTypeOptionsConstant.find(
    (a) => a.value === applicationCard.type,
  )!.label;
  const jobType: ApplicationJobTypeLabel =
    applicationsJobTypeOptionsConstant.find(
      (a) => a.value === applicationCard.jobType,
    )!.label;
  const level: ApplicationLevelLabel = applicationsLevelOptionsConstant.find(
    (a) => a.value === applicationCard.level,
  )!.label;
  return (
    <div className="bg-card text-card-foreground border-accent flex cursor-pointer flex-col gap-3 rounded-lg border p-6 shadow-xs transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <p className="tracking-light text-lg font-semibold">
            {applicationCard.position}
          </p>
          <p className="flex items-center gap-2">
            <Building className="text-muted-foreground h-4 w-4" />
            <span className="font-medium">{applicationCard.companyName}</span>
          </p>
          <p className="text-muted-foreground text-xs">
            {applicationCard.companyEmail}
          </p>
        </div>
        <div>
          <p
            className={`inline-flex ${ApplicationStatusToColor[status]} items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-300`}
          >
            {status}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4" />
          <span>{applicationCard.location}</span>
        </div>
        <div className="text-foreground flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all">
          {type}
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <DollarSign className="text-muted-foreground h-3 w-3" />
          <p>
            {applicationCard.startSalary}k-{applicationCard.endSalary}k
          </p>
        </div>
        <div className="text-foreground flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all">
          {level}
        </div>
      </div>

      <div className="text-foreground flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all">
        {jobType}
      </div>

      <TechnologiesUsed technologies={applicationCard.technologiesUsed || []} />

      <div className="border-accent flex flex-col gap-2 border-t pt-2">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Calendar className="h-3 w-3" />
          <span>
            Applied:{" "}
            {applicationCard.createdAt &&
              applicationCard.createdAt
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-")}
          </span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Clock className="h-3 w-3" />
          <span>
            Last Update:{" "}
            {applicationCard.updatedAt &&
              formatDistanceToNow(applicationCard.updatedAt, {
                addSuffix: true,
              })}
          </span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <CalendarClock className="h-3 w-3" />
          <span>
            Deadline:{" "}
            {applicationCard.deadline &&
              applicationCard.deadline
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-")}
          </span>
        </div>
      </div>
      <div className="bg-accent rounded-lg p-3">
        <p className="text-muted-foreground text-sm italic">
          "{applicationCard.notes}"
        </p>
      </div>
      <div className="mt-2 flex flex-1 items-center gap-2">
        <ViewApplicationButton />
        <EditApplicationButton />
      </div>
    </div>
  );
}
