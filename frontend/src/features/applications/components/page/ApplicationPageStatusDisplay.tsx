import {
  ApplicationPageStatusDate,
  capitalize,
  getStepsWithLastStatus,
  STATUS_TO_DATE_KEY,
  STATUS_TO_VALUE,
  uncapitalize,
  type ApplicationCardProps,
} from "#/applications";

export default function ApplicationPageStatusDisplay({
  applicationCard,
}: ApplicationCardProps) {
  const applicationStatus = capitalize(applicationCard.status);
  const stepsWithLastStatus = getStepsWithLastStatus(applicationCard.status);
  return (
    <div className="flex flex-col">
      {stepsWithLastStatus.map((step, index) => {
        const applicationStatusDate =
          applicationCard[STATUS_TO_DATE_KEY[uncapitalize(step)]];

        const isLast = index === stepsWithLastStatus.length - 1;

        return (
          <div key={`${applicationCard.id}-${index}`}>
            <div className="-mt-1 flex items-center gap-2">
              <div
                className={` ${STATUS_TO_VALUE[step] <= STATUS_TO_VALUE[applicationStatus] ? "outline-input outline-2" : ""} bg-background border-muted-foreground flex size-4 items-center justify-center rounded-full border outline`}
              >
                <div
                  className={`${STATUS_TO_VALUE[step] <= STATUS_TO_VALUE[applicationStatus] ? "bg-muted-foreground size-1.5 rounded-full" : ""} `}
                ></div>
              </div>
              <ApplicationPageStatusDate
                applicationStatusDate={
                  applicationStatusDate instanceof Date
                    ? applicationStatusDate
                    : undefined
                }
                selected={
                  STATUS_TO_VALUE[step] > STATUS_TO_VALUE[applicationStatus]
                }
                applicationCard={applicationCard}
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
