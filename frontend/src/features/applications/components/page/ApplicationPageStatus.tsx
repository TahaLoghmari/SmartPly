import {
  ApplicationStatusControl,
  ApplicationPageStatusDisplay,
  type ApplicationCardProps,
} from "#/applications";

export default function ApplicationPageStatus({
  applicationCard,
}: ApplicationCardProps) {
  return (
    <div className="mb-4 flex w-full flex-1 justify-center lg:flex-none">
      <div className="bg-card mt-8 flex w-[90%] flex-col gap-6 rounded-lg border p-4 shadow-xs lg:mt-0 lg:w-full">
        <p className="font-medium">Application Status</p>
        <ApplicationStatusControl
          applicationCard={applicationCard}
          className="w-full"
        />
        <ApplicationPageStatusDisplay applicationCard={applicationCard} />
      </div>
    </div>
  );
}
