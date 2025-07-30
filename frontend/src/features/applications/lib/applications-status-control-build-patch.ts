import { type JsonPatchDto } from "@/types";
import { capitalize, uncapitalize, statusToValue, steps } from "#/applications";
import { type ApplicationResponseDto } from "#/applications";

export function ApplicationStatusControlBuildPatch(
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
