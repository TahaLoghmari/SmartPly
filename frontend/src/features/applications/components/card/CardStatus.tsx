import React from "react";
import {
  capitalize,
  uncapitalize,
  getStepsWithLastStatus,
  STATUS_TO_DATE_KEY,
  STATUS_TO_VALUE,
  formatDate,
  type ApplicationCardProps,
} from "#/applications";

export default function CardStatus({ applicationCard }: ApplicationCardProps) {
  const applicationStatus = capitalize(applicationCard.status);
  const stepsWithLastStatus = getStepsWithLastStatus(applicationCard.status);

  return (
    <div className="flex flex-1 items-center">
      {stepsWithLastStatus.map((step, index) => {
        const applicationStatusDate: Date = applicationCard[
          STATUS_TO_DATE_KEY[uncapitalize(step)]
        ] as Date;
        const isLast = index === stepsWithLastStatus.length - 1;
        return (
          <React.Fragment key={`${applicationCard.id}-${index}`}>
            <div className="flex h-full min-w-[53px] flex-col items-center gap-2">
              <p className="text-xs font-normal">{step}</p>
              <div
                className={` ${STATUS_TO_VALUE[step] <= STATUS_TO_VALUE[applicationStatus] ? "outline-input outline-2" : ""} bg-background border-muted-foreground flex size-5 items-center justify-center rounded-full border`}
              >
                <div
                  className={`${STATUS_TO_VALUE[step] <= STATUS_TO_VALUE[applicationStatus] ? "bg-muted-foreground size-4 rounded-full" : ""} `}
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
