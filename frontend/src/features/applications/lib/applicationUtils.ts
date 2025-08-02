import { type JsonPatchDto } from "@/types";
import {
  statusToValue,
  steps,
  statusToDateKey,
  type ApplicationRequestDto,
  type ApplicationResponseDto,
} from "#/applications";

export function ApplicationsStatusControlBuildPatch(
  applicationCard: ApplicationResponseDto,
  newStatus: string,
): JsonPatchDto[] {
  const stepsWithLastStatus = [...steps, "Offer", "Rejected", "Ghosted"];
  const newStatus_UpperCase = capitalize(newStatus);

  return [
    {
      op: "replace",
      path: "/status",
      value: newStatus,
    },
    ...stepsWithLastStatus
      .filter(
        (step) => statusToValue[step] > statusToValue[newStatus_UpperCase],
      )
      .map((step) => ({
        op: "replace" as const,
        path: `/${uncapitalize(step)}Date`,
        value: null,
      })),
    ...stepsWithLastStatus
      .filter(
        (step) => statusToValue[step] <= statusToValue[newStatus_UpperCase],
      )
      .map((step) => {
        const dateToChange = `${uncapitalize(step)}Date`;
        return {
          op: "replace" as const,
          path: `/${dateToChange}`,
          value:
            (applicationCard as any)[dateToChange] &&
            (applicationCard as any)[dateToChange] <= new Date()
              ? (applicationCard as any)[dateToChange]
              : new Date().toISOString(),
        };
      }),
  ];
}

export interface ApplicationsFormHandleStatusChangeProps {
  credentials: ApplicationRequestDto;
  applicationCard: ApplicationResponseDto;
}

export const ApplicationsFormHandleStatusChange = ({
  credentials,
  applicationCard,
}: ApplicationsFormHandleStatusChangeProps) => {
  const allSteps = [...steps, "Offer", "Ghosted", "Rejected"];
  allSteps.map((step) => {
    const step_lowerCase = uncapitalize(step);
    const field = statusToDateKey[step_lowerCase];
    if (statusToValue[step] <= statusToValue[capitalize(credentials.status)]) {
      // If the date is already set and is in the past or now, keep it.
      // Otherwise, set it to the current date.
      if (
        (applicationCard as any)[field] &&
        (applicationCard as any)[field] <= new Date()
      ) {
        // Keep the existing date
        (credentials as any)[field] = (applicationCard as any)[field];
      } else {
        // Set to now
        (credentials as any)[field] = new Date().toISOString();
      }
    } else (credentials as any)[field] = null;
  });
};

export function capitalize(status: string) {
  return status[0].toUpperCase() + status.slice(1);
}

export function uncapitalize(status: string) {
  return status[0].toLowerCase() + status.slice(1);
}

export function getStepsWithLastStatus(status: string) {
  return status === "rejected" || status === "ghosted"
    ? [...steps, "Offer", capitalize(status)]
    : [...steps, "Offer"];
}

export function formatDate(date: Date) {
  if (date instanceof Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;
    return `${day}/${month}/${year}`;
  }
  return typeof date === "string" ? date : "";
}
