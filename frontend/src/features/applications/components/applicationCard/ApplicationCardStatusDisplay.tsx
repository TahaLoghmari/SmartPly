import React from "react";
import {
  statusToDateKey,
  statusToValue,
  steps,
  type ApplicationResponseDto,
} from "#/applications";

export function ApplicationCardStatusDisplay({
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
    <div className="flex flex-1 items-center">
      {stepsWithLastStatus.map((step, index) => {
        const applicationStatusDate =
          applicationCard[
            statusToDateKey[step[0].toLowerCase() + step.slice(1)]
          ];
        return (
          <React.Fragment key={`${applicationCard.id}-${index}`}>
            <div className="flex h-full min-w-[53px] flex-col items-center gap-2">
              <p className="text-xs font-normal">{step}</p>
              <div
                className={` ${statusToValue[step] <= statusToValue[applicationStatus] ? "outline-input outline-2" : ""} bg-background border-muted-foreground flex size-5 items-center justify-center rounded-full border`}
              >
                <div
                  className={`${statusToValue[step] <= statusToValue[applicationStatus] ? "bg-muted-foreground size-2 rounded-full" : ""} `}
                ></div>
              </div>
              <p className="flex h-4 min-w-11 items-center justify-center text-xs">
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
              </p>
            </div>
            {step != lastStatus[lastStatus.length - 1] && (
              <div className="bg-muted-foreground z-0 -mx-[17px] h-px w-full rounded text-center text-xs leading-none"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
