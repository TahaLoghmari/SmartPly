import {
  ApplicationsPageStatusDate,
  capitalize,
  getStepsWithLastStatus,
  statusToDateKey,
  statusToValue,
  uncapitalize,
  type ApplicationCardProps,
} from "#/applications";

export function ApplicationsPageStatusDisplay({
  applicationCard,
}: ApplicationCardProps) {
  const applicationStatus = capitalize(applicationCard.status);
  const stepsWithLastStatus = getStepsWithLastStatus(applicationCard.status);
  return (
    <div className="flex flex-col">
      {stepsWithLastStatus.map((step, index) => {
        const applicationStatusDate =
          applicationCard[statusToDateKey[uncapitalize(step)]];

        const isLast = index === stepsWithLastStatus.length - 1;

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
              <ApplicationsPageStatusDate
                applicationStatusDate={
                  applicationStatusDate instanceof Date
                    ? applicationStatusDate
                    : undefined
                }
                step={step}
                id={applicationCard.id}
              />
            </div>
            {!isLast && (
              <div className="bg-muted-foreground -mt-1 ml-[7.5px] h-7 w-px"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
