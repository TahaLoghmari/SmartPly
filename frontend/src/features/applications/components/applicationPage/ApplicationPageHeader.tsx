import { DollarSign, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TechnologiesUsed,
  type ApplicationTypeLabel,
  type ApplicationJobTypeLabel,
  type ApplicationLevelLabel,
  type ApplicationPageProps,
  applicationsTypeOptionsConstant,
  applicationsJobTypeOptionsConstant,
  applicationsLevelOptionsConstant,
} from "#/applications";

export function ApplicationPageHeader({
  applicationCard,
}: ApplicationPageProps) {
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
    <div className="bg-card text-card-foreground flex flex-1 flex-col gap-3 rounded-lg border p-6">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="mb-2 flex items-center gap-2">
            <div className="bg-accent flex h-16 w-16 items-center justify-center rounded-xl">
              <Building2 className="text-accent-foreground h-8 w-8" />
            </div>
            <div>
              <p className="tracking-light text-2xl font-bold">
                {applicationCard.position}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">
                  {applicationCard.companyName}
                </span>
              </p>
              <p className="text-muted-foreground text-xs">
                {applicationCard.companyEmail}
              </p>
            </div>
          </div>
        </div>
        <div>
          <a
            href={applicationCard.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="cursor-pointer">
              View Job Posting
            </Button>
          </a>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4" />
          <span>{applicationCard.location}</span>
        </div>
        <div className="text-foreground flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-[width,height,margin,padding]">
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
        <div className="text-foreground flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-[width,height,margin,padding]">
          {level}
        </div>
      </div>

      <div className="text-foreground flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-[width,height,margin,padding]">
        {jobType}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-foreground text-sm font-medium">Technologies:</p>
        <TechnologiesUsed
          technologies={applicationCard.technologiesUsed || []}
        />
      </div>
    </div>
  );
}
