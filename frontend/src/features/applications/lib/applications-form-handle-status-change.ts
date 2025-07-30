import {
  type ApplicationRequestDto,
  statusToValue,
  steps,
  statusToDateKey,
  type ApplicationResponseDto,
} from "#/applications";

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
    const step_lowerCase = step[0].toLowerCase() + step.slice(1);
    const field = statusToDateKey[step_lowerCase];
    if (
      statusToValue[step] <=
      statusToValue[
        credentials.status[0].toUpperCase() + credentials.status.slice(1)
      ]
    ) {
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
        (credentials as any)[field] = new Date();
      }
    } else (credentials as any)[field] = null;
  });
};
