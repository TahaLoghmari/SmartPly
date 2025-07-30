import {
  ApplicationsStatusControl,
  ApplicationsPageStatusDisplay,
  type ApplicationCardProps,
} from "#/applications";

export function ApplicationsPageStatus({
  applicationCard,
}: ApplicationCardProps) {
  return (
    <div className="bg-card flex w-full flex-col gap-6 rounded-lg border p-4 shadow-xs">
      <p className="font-medium">Application Status</p>
      <ApplicationsStatusControl
        applicationCard={applicationCard}
        className="w-full"
      />
      <ApplicationsPageStatusDisplay applicationCard={applicationCard} />
    </div>
  );
}
