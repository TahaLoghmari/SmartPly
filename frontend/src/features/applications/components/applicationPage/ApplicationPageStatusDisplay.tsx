import {
  ApplicationPageStatusDate,
  statusToDateKey,
  statusToValue,
  steps,
  type ApplicationResponseDto,
} from "#/applications";

export function ApplicationPageStatusDisplay({
  applicationCard,
}: {
  applicationCard: ApplicationResponseDto;
}) {
  const applicationStatus =
    applicationCard.status[0].toUpperCase() + applicationCard.status.slice(1);

  const lastStatus =
    applicationCard.status === "rejected" ||
    applicationCard.status === "ghosted"
      ? ["Offer", applicationStatus]
      : ["Offer"];

  const stepsWithLastStatus = [...steps, ...lastStatus];
  return (
    <div className="flex flex-col">
      {stepsWithLastStatus.map((step, index) => {
        const status_lower_case = step[0].toLowerCase() + step.slice(1);

        const applicationStatusDate =
          applicationCard[statusToDateKey[status_lower_case]];

        return (
          <div key={`${applicationCard.id}-${index}`}>
            <div className="-mt-1 flex items-center gap-2">
              <div
                className={` ${statusToValue[step] <= statusToValue[applicationStatus] ? "outline-input outline-2" : ""} bg-background border-muted-foreground flex size-4 items-center justify-center rounded-full border outline`}
              >
                <div
                  className={`${statusToValue[step] <= statusToValue[applicationStatus] ? "bg-muted-foreground size-1.5 rounded-full" : ""} `}
                ></div>
              </div>
              <ApplicationPageStatusDate
                applicationStatusDate={
                  applicationStatusDate instanceof Date
                    ? applicationStatusDate
                    : undefined
                }
                step={step}
                id={applicationCard.id}
              />
            </div>
            {step != lastStatus[lastStatus.length - 1] && (
              <div className="bg-muted-foreground -mt-1 ml-[7.5px] h-7 w-px"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
