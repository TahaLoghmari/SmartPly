import {
  ApplicationCardInfo,
  ApplicationStatusControl,
  ApplicationCardStatus,
  useApplicationManageJobsStore,
  ApplicationLikeButton,
  type ApplicationCardProps,
} from "#/applications";
import { NavLink } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

export default function Card({ applicationCard }: ApplicationCardProps) {
  const {
    isSelecting,
    addApplication,
    removeApplication,
    selectedApplications,
  } = useApplicationManageJobsStore();
  return (
    <NavLink
      to={`/app/applications/${applicationCard.id}`}
      className={`bg-card flex items-center gap-6 rounded-lg border p-4 shadow-xs hover:cursor-pointer hover:bg-[var(--accent-light)]`}
    >
      {isSelecting ? (
        <div
          className="flex w-6 items-center justify-center"
          onClick={(e) => e.preventDefault()}
        >
          <Checkbox
            className="border-muted-foreground"
            checked={selectedApplications.includes(applicationCard.id)}
            onCheckedChange={(checked) => {
              return checked
                ? addApplication(applicationCard.id)
                : removeApplication(applicationCard.id);
            }}
          />
        </div>
      ) : (
        <ApplicationLikeButton applicationCard={applicationCard} />
      )}

      <ApplicationCardInfo applicationCard={applicationCard} />
      <ApplicationCardStatus applicationCard={applicationCard} />
      <ApplicationStatusControl
        applicationCard={applicationCard}
        className="w-[120px]"
      />
    </NavLink>
  );
}
