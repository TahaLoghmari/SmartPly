import {
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
        const applicationStatusDate =
          applicationCard[
            statusToDateKey[step[0].toLowerCase() + step.slice(1)]
          ];
        return (
          <div key={`${applicationCard.id}-${index}`} className="flex flex-col">
            <div className="-mt-1 flex items-center gap-2">
              <div
                className={` ${statusToValue[step] <= statusToValue[applicationStatus] ? "outline-accent outline-2" : ""} bg-background border-muted-foreground flex size-5 items-center justify-center rounded-full border`}
              >
                <div
                  className={`${statusToValue[step] <= statusToValue[applicationStatus] ? "bg-muted-foreground size-2 rounded-full" : ""} `}
                ></div>
              </div>
              <p className="flex items-center font-medium">
                {step}
                <span className="text-muted-foreground ml-2 flex items-center text-xs font-normal">
                  {applicationStatusDate
                    ? applicationStatusDate instanceof Date
                      ? (() => {
                          const d = applicationStatusDate;
                          const day = d.getDate();
                          const month = d.getMonth() + 1;
                          const year = d.getFullYear() % 100;
                          return `${day}/${month}/${year}`;
                        })()
                      : applicationStatusDate.toString()
                    : ""}
                </span>
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
                className="text-muted-foreground h-3 w-3 cursor-pointer"
              >
                <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
              </svg>
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
