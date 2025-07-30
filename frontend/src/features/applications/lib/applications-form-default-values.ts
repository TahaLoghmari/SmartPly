import {
  type ApplicationRequestDto,
  type ApplicationResponseDto,
} from "#/applications";

export function ApplicationsFormDefaultValues(
  card: ApplicationResponseDto | undefined,
  userId: string,
): ApplicationRequestDto {
  return {
    resumeId: card?.resumeId || "",
    coverLetterId: card?.coverLetterId || "",
    userId,
    companyName: card?.companyName || "",
    companyEmail: card?.companyEmail || "",
    position: card?.position || "",
    link: card?.link || "",
    notes: card?.notes || "",
    location: card?.location || "",
    jobDescription: card?.jobDescription || "",
    isLiked: false,
    startSalary: card?.startSalary || 0,
    endSalary: card?.endSalary || 0,
    deadline: card?.deadline,
    status: card?.status || "applied",
    type: card?.type || "onSite",
    jobType: card?.jobType || "fullTime",
    level: card?.level || "junior",
    technologiesUsed: card?.technologiesUsed || [],
  };
}
