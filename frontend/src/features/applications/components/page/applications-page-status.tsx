import {
  ApplicationsStatusControl,
  ApplicationsPageStatusDisplay,
  type ApplicationResponseDto,
} from "#/applications";

export function ApplicationsPageStatus({
  applicationCard,
}: {
  applicationCard: ApplicationResponseDto;
}) {
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
