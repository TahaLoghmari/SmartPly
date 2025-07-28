import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { BriefcaseBusiness } from "lucide-react";
import { type ApplicationResponseDto } from "#/applications";

export function ApplicationsCardInfo({
  applicationCard,
}: {
  applicationCard: ApplicationResponseDto;
}) {
  return (
    <div className="flex flex-1 items-center gap-4">
      <div className="rounded-sm bg-gradient-to-r from-gray-500 to-gray-400 p-3 text-white">
        <BriefcaseBusiness className="h-8 w-8" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1">
        <p className="text-base leading-5 font-medium">
          {applicationCard.position}
        </p>
        <div className="text-muted-foreground flex items-center gap-1 truncate text-sm leading-5">
          <FontAwesomeIcon icon={faBuilding} />
          <p>{applicationCard.companyName}</p>
        </div>
        <div className="text-muted-foreground flex items-center gap-1 truncate text-sm leading-5">
          <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
          <p>{applicationCard.location}</p>
        </div>
      </div>
    </div>
  );
}
