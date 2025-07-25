import {
  type ApplicationCardProps,
  applicationsStatusOptionsConstant,
  statusToDateKey,
  steps,
  statusToValue,
} from "#/applications";
import { Heart, BriefcaseBusiness } from "lucide-react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faBuilding } from "@fortawesome/free-solid-svg-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export function ApplicationCard({ applicationCard }: ApplicationCardProps) {
  const applicationStatus =
    applicationCard.status[0].toUpperCase() + applicationCard.status.slice(1);
  const lastStatus =
    applicationCard.status === "rejected" ||
    applicationCard.status === "ghosted"
      ? {
          label: applicationStatus,
        }
      : { label: "Offer" };

  const stepsWithLastStatus = [...steps, lastStatus];
  return (
    <NavLink
      to={`/app/applications/${applicationCard.id}`}
      className={`bg-card flex items-center gap-6 rounded-lg border p-4 shadow-xs hover:bg-[var(--accent-light)]`}
    >
      <Heart className="text-muted-foreground h-4 w-4" />
      <div className="flex flex-1 items-center gap-4">
        <div className="rounded-sm bg-gradient-to-r from-gray-500 to-gray-400 p-3 text-white">
          <BriefcaseBusiness className="h-8 w-8" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1">
          <p className="text-base leading-5 font-medium">
            {applicationCard.position}
          </p>
          <div className="text-muted-foreground flex items-center gap-1 truncate text-sm leading-5">
            <FontAwesomeIcon icon={faBuilding} />
            <p>{applicationCard.companyName}</p>
          </div>
          <div className="text-muted-foreground flex items-center gap-1 truncate text-sm leading-5">
            <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
            <p>{applicationCard.location}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center">
        {stepsWithLastStatus.map((step, index) => {
          const applicationStatusDate =
            applicationCard[
              statusToDateKey[step.label[0].toLowerCase() + step.label.slice(1)]
            ];
          return (
            <React.Fragment key={index}>
              <div className="flex h-full min-w-[53px] flex-col items-center gap-2">
                <p className="text-xs font-normal">{step.label}</p>
                <div
                  className={` ${statusToValue[step.label] <= statusToValue[applicationStatus] ? "outline-accent outline-2" : ""} bg-background border-muted-foreground flex size-5 items-center justify-center rounded-full border`}
                >
                  <div
                    className={`${statusToValue[step.label] <= statusToValue[applicationStatus] ? "bg-muted-foreground size-2 rounded-full" : ""} `}
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
              {step.label != lastStatus.label && (
                <div className="bg-muted-foreground z-0 -mx-[17px] h-px w-full rounded text-center text-xs leading-none"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <Select>
        <SelectTrigger className="w-[120px] cursor-pointer">
          <SelectValue
            placeholder="Status"
            className="text-primary placeholder:text-primary text-sm"
          />
        </SelectTrigger>
        <SelectContent>
          {applicationsStatusOptionsConstant.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </NavLink>
  );
}
