import React from "react";
import {
  capitalize,
  uncapitalize,
  getStepsWithLastStatus,
  statusToDateKey,
  statusToValue,
  type ApplicationResponseDto,
  formatDate,
} from "#/applications";

export function ApplicationsCardStatusDisplay({
  applicationCard,
}: {
  applicationCard: ApplicationResponseDto;
}) {
  const applicationStatus = capitalize(applicationCard.status);
  const stepsWithLastStatus = getStepsWithLastStatus(applicationCard.status);

  return (
    <div className="flex flex-1 items-center">
      {stepsWithLastStatus.map((step, index) => {
        const applicationStatusDate =
          applicationCard[statusToDateKey[uncapitalize(step)]];
        const isLast = index === stepsWithLastStatus.length - 1;
        return (
          <React.Fragment key={`${applicationCard.id}-${index}`}>
            <div className="flex h-full min-w-[53px] flex-col items-center gap-2">
              <p className="text-xs font-normal">{step}</p>
              <div
                className={` ${statusToValue[step] <= statusToValue[applicationStatus] ? "outline-input outline-2" : ""} bg-background border-muted-foreground flex size-5 items-center justify-center rounded-full border`}
              >
                <div
                  className={`${statusToValue[step] <= statusToValue[applicationStatus] ? "bg-muted-foreground size-4 rounded-full" : ""} `}
                ></div>
              </div>
              <p className="flex h-4 min-w-11 items-center justify-center text-xs">
                {formatDate(applicationStatusDate)}
              </p>
            </div>
            {!isLast && (
              <div className="bg-muted-foreground z-0 -mx-[17px] h-px w-full rounded text-center text-xs leading-none"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
