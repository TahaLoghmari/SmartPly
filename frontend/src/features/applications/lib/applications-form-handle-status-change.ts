import {
  statusToValue,
  steps,
  statusToDateKey,
  capitalize,
  uncapitalize,
  type ApplicationRequestDto,
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
