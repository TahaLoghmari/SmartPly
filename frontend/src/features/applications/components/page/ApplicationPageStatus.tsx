import {
  ApplicationStatusControl,
  ApplicationPageStatusDisplay,
  type ApplicationCardProps,
} from "#/applications";

export default function ApplicationPageStatus({ applicationCard }: ApplicationCardProps) {
  return (
    <div className="bg-card flex w-full flex-col gap-6 rounded-lg border p-4 shadow-xs">
      <p className="font-medium">Application Status</p>
      <ApplicationStatusControl
        applicationCard={applicationCard}
        className="w-full"
      />
      <ApplicationPageStatusDisplay applicationCard={applicationCard} />
    </div>
  );
}
