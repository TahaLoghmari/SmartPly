import {
  APPLICATIONS_JOB_TYPE_OPTIONS,
  APPLICATIONS_LEVEL_OPTIONS,
  APPLICATIONS_TYPE_OPTIONS,
  ApplicationTechnologiesUsed,
  type ApplicationJobTypeLabel,
  type ApplicationLevelLabel,
  type ApplicationTypeLabel,
  type ApplicationCardProps,
} from "#/applications";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";

export default function ApplicationPageOverview({
  applicationCard,
}: ApplicationCardProps) {
  const type: ApplicationTypeLabel = APPLICATIONS_TYPE_OPTIONS.find(
    (a) => a.value === applicationCard.type,
  )!.label;
  const jobType: ApplicationJobTypeLabel = APPLICATIONS_JOB_TYPE_OPTIONS.find(
    (a) => a.value === applicationCard.jobType,
  )!.label;
  const level: ApplicationLevelLabel = APPLICATIONS_LEVEL_OPTIONS.find(
    (a) => a.value === applicationCard.level,
  )!.label;
  return (
    <div className="flex flex-col gap-6 px-8 py-6">
      <p className="text-lg font-medium">Job Posting</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Location</p>
          <p className="truncate text-sm">
            {applicationCard.location || "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Job Type</p>
          <p className="truncate text-sm">{jobType || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Type</p>
          <p className="truncate text-sm">{type || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Level</p>
          <p className="truncate text-sm">{level || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">URL</p>
          <a
            href={applicationCard.link}
            className="truncate text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            {applicationCard.link || "N/A"}
          </a>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Deadline</p>
          <p className="truncate text-sm">
            {(applicationCard.deadline &&
              applicationCard.deadline
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-")) ||
              "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Created</p>
          <p className="truncate text-sm">
            {(applicationCard.createdAt &&
              applicationCard.createdAt
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-")) ||
              "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Last Update</p>
          <p className="truncate text-sm">
            {(applicationCard.updatedAt &&
              formatDistanceToNow(applicationCard.updatedAt, {
                addSuffix: true,
              })) ||
              "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Technologies</p>
          {applicationCard.technologiesUsed ? (
            <ApplicationTechnologiesUsed
              className="py-1.5"
              technologies={applicationCard.technologiesUsed || []}
            />
          ) : (
            "N/A"
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Salary</p>
          <div className="flex items-center gap-2">
            {applicationCard.startSalary && applicationCard.endSalary ? (
              <>
                <p className="text-sm font-normal">
                  ${applicationCard.startSalary}k - ${applicationCard.endSalary}
                  k
                </p>
                <span className="bg-accent text-accent-foreground rounded-full p-1.5 px-3 text-xs font-normal">
                  /yr
                </span>
              </>
            ) : (
              <p className="text-sm font-normal">N/A</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Description</p>
          <div className="prose max-w-none text-sm">
            {applicationCard.jobDescription &&
            applicationCard.jobDescription.length > 0 ? (
              <ReactMarkdown>{applicationCard.jobDescription}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">-</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
