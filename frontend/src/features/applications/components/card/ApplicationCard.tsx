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

export default function ApplicationCard({
  applicationCard,
}: ApplicationCardProps) {
  const {
    isSelecting,
    addApplication,
    removeApplication,
    selectedApplications,
  } = useApplicationManageJobsStore();
  return (
    <NavLink
      to={`/app/applications/${applicationCard.id}`}
      className={`bg-card relative flex items-center gap-6 rounded-lg border p-4 shadow-xs hover:cursor-pointer hover:bg-[var(--accent-light)]`}
    >
      {isSelecting ? (
        <div
          className="absolute top-4 right-4 flex w-6 items-center justify-center sm:static sm:top-0 sm:right-0"
          onClick={(e) => e.preventDefault()}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
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
        </div>
      ) : (
        <ApplicationLikeButton applicationCard={applicationCard} />
      )}
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
        <ApplicationCardInfo applicationCard={applicationCard} />
        <ApplicationCardStatus applicationCard={applicationCard} />
      </div>

      <ApplicationStatusControl
        applicationCard={applicationCard}
        className="hidden w-[120px] lg:flex"
      />
    </NavLink>
  );
}
