import { type ApplicationRequestDto } from "#/applications";

export function ApplicationsFormGetDefaultValues(
  card: any,
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
    startSalary: card?.startSalary,
    endSalary: card?.endSalary,
    deadline: card?.deadline,
    status: card?.status || "applied",
    type: card?.type || "onSite",
    jobType: card?.jobType || "fullTime",
    level: card?.level || "junior",
    technologiesUsed: card?.technologiesUsed || [],
  };
}
