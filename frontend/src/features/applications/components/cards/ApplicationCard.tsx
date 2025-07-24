import {
  type ApplicationCardProps,
  applicationsStatusOptionsConstant,
  steps,
} from "#/applications";
import { Heart, BriefcaseBusiness } from "lucide-react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faBuilding,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export function ApplicationCard({ applicationCard }: ApplicationCardProps) {
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
      <div className="flex flex-1">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex h-full flex-shrink-0 flex-col items-center gap-2">
              <p className="text-xs font-normal">{step.label}</p>
              <div
                className={` ${step.status === "complete" ? "text-muted-foreground" : "text-card"} bg-accent flex size-[22px] items-center justify-center rounded-full`}
              >
                <FontAwesomeIcon icon={faCircle} className="h-4 w-4" />
              </div>

              <p className="flex h-4 min-w-11 items-center justify-center text-xs">
                {step.status === "complete" ? step.date : ""}
              </p>
            </div>
            {step.label != "Offer" && (
              <div className="bg-accent -mx-3.5 flex flex-1 grow items-center self-center py-0.5"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <Select>
        <SelectTrigger className="w-[120px]">
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
