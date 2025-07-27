import {
  ApplicationCardInfo,
  type ApplicationCardProps,
  ApplicationStatusControl,
  ApplicationCardStatusDisplay,
  LikeApplicationButton,
} from "#/applications";
import { NavLink } from "react-router-dom";

export function ApplicationCard({ applicationCard }: ApplicationCardProps) {
  return (
    <NavLink
      to={`/app/applications/${applicationCard.id}`}
      className={`bg-card flex items-center gap-6 rounded-lg border p-4 shadow-xs hover:cursor-pointer hover:bg-[var(--accent-light)]`}
    >
      <LikeApplicationButton applicationCard={applicationCard} />
      <ApplicationCardInfo applicationCard={applicationCard} />
      <ApplicationCardStatusDisplay applicationCard={applicationCard} />
      <ApplicationStatusControl applicationCard={applicationCard} />
    </NavLink>
  );
}
