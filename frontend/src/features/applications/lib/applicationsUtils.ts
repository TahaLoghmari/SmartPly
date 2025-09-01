import { type JsonPatchDto } from "@/types/api.types";
import {
  STATUS_TO_VALUE,
  STEPS,
  type ApplicationResponseDto,
} from "#/applications";

export function ApplicationsStatusControlBuildPatch(
  applicationCard: ApplicationResponseDto,
  newStatus: string,
): JsonPatchDto[] {
  const stepsWithLastStatus = [...STEPS, "Offer", "Rejected", "Ghosted"];
  const newStatus_UpperCase = capitalize(newStatus);

  const patchRequest: JsonPatchDto[] = [
    {
      op: "replace",
      path: "/status",
      value: newStatus,
    },
    ...stepsWithLastStatus
      .filter(
        (step) => STATUS_TO_VALUE[step] > STATUS_TO_VALUE[newStatus_UpperCase],
      )
      .map((step) => ({
        op: "replace" as const,
        path: `/${uncapitalize(step)}Date`,
        value: null,
      })),
    ...stepsWithLastStatus
      .filter(
        (step) => STATUS_TO_VALUE[step] <= STATUS_TO_VALUE[newStatus_UpperCase],
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

  return patchRequest;
}

export function capitalize(status: string) {
  return status[0].toUpperCase() + status.slice(1);
}

export function uncapitalize(status: string) {
  return status[0].toLowerCase() + status.slice(1);
}

export function getStepsWithLastStatus(status: string) {
  return status === "rejected" || status === "ghosted"
    ? [...STEPS, "Offer", capitalize(status)]
    : [...STEPS, "Offer"];
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

export const mapApplicationDates = (app: ApplicationResponseDto) => ({
  ...app,
  createdAt: new Date(app.createdAt),
  updatedAt: new Date(app.updatedAt),
  deadline: app.deadline ? new Date(app.deadline) : undefined,
  wishListDate: app.wishListDate ? new Date(app.wishListDate) : undefined,
  appliedDate: app.appliedDate ? new Date(app.appliedDate) : undefined,
  interviewDate: app.interviewDate ? new Date(app.interviewDate) : undefined,
  offerDate: app.offerDate ? new Date(app.offerDate) : undefined,
  rejectedDate: app.rejectedDate ? new Date(app.rejectedDate) : undefined,
  ghostedDate: app.ghostedDate ? new Date(app.ghostedDate) : undefined,
});
