import {
  ApplicationCardInfo,
  type ApplicationCardProps,
  ApplicationCardStatusControl,
  ApplicationCardStatusDisplay,
} from "#/applications";
import { Heart } from "lucide-react";
import { NavLink } from "react-router-dom";

export function ApplicationCard({ applicationCard }: ApplicationCardProps) {
  return (
    <NavLink
      to={`/app/applications/${applicationCard.id}`}
      className={`bg-card flex items-center gap-6 rounded-lg border p-4 shadow-xs hover:bg-[var(--accent-light)]`}
    >
      <Heart className="text-muted-foreground h-4 w-4" />
      <ApplicationCardInfo applicationCard={applicationCard} />
      <ApplicationCardStatusDisplay applicationCard={applicationCard} />
      <ApplicationCardStatusControl applicationCard={applicationCard} />
    </NavLink>
  );
}
