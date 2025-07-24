import { BriefcaseBusiness } from "lucide-react";
import {
  EditApplicationButton,
  DeleteApplicationButton,
  type ApplicationResponseDto,
} from "#/applications";

export function ApplicationPageHeader({
  applicationCard,
}: {
  applicationCard: ApplicationResponseDto;
}) {
  return (
    <div className="flex items-center justify-between border-b px-8 py-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="rounded-sm bg-gradient-to-r from-gray-500 to-gray-400 p-3 text-white">
          <BriefcaseBusiness className="h-8 w-8" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1">
          <p className="text-base leading-5 font-medium">
            {applicationCard.position}
          </p>
          <div className="text-muted-foreground flex items-center gap-1 truncate text-sm leading-5">
            <p>{applicationCard.companyName}</p>
          </div>
          <div className="flex items-center gap-1 truncate text-sm leading-5">
            <p>{applicationCard.companyEmail}</p>
          </div>
        </div>
      </div>
      <div className="mr-6 flex items-center gap-4">
        <EditApplicationButton applicationCard={applicationCard} />
        <DeleteApplicationButton applicationCard={applicationCard} />
      </div>
    </div>
  );
}
