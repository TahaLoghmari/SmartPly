import {
  ApplicationStatusControl,
  ApplicationPageStatusDisplay,
  type ApplicationResponseDto,
} from "#/applications";

export function ApplicationPageStatus({
  applicationCard,
}: {
  applicationCard: ApplicationResponseDto;
}) {
  return (
    <div className="bg-card flex w-full flex-col gap-6 rounded-lg border p-4 shadow-xs">
      <p className="font-medium">Application Status</p>
      <ApplicationStatusControl applicationCard={applicationCard} />
      <ApplicationPageStatusDisplay applicationCard={applicationCard} />
    </div>
  );
}
