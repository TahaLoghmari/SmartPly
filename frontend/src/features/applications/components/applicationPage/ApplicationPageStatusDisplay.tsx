import {
  statusToDateKey,
  statusToValue,
  steps,
  usePatchApplication,
  type ApplicationResponseDto,
} from "#/applications";
import Calendar01 from "@/components/Calendar01";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ApplicationPageStatusDisplay({
  applicationCard,
}: {
  applicationCard: ApplicationResponseDto;
}) {
  const patchApplicationMutation = usePatchApplication();
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
              <Popover>
                <PopoverTrigger>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                    className="text-muted-foreground h-3 w-3 cursor-pointer"
                    onClick={() => {}}
                  >
                    <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
                  </svg>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar01 />
                </PopoverContent>
              </Popover>
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
