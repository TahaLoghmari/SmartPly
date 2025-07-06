import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";
import {
  applicationsStatusFilterOptionsConstant,
  applicationsTypeFilterOptionsConstant,
  applicationsJobTypeFilterOptionsConstant,
  applicationsLevelFilterOptionsConstant,
} from "#/applications";

export const formSchema = z.object({
  resumeId: z.string().min(1, "ResumeId is required."),
  coverLetterId: z.string().optional(),
  userId: z
    .string()
    .min(1, "UserId is required.")
    .max(100, "UserId must be at most 100 characters."),
  companyName: z
    .string()
    .min(1, "Company name is required.")
    .max(100, "Company name must be at most 100 characters."),
  companyEmail: z
    .string()
    .email("CompanyEmail must be a valid email address.")
    .max(320, "CompanyEmail must be at most 320 characters.") // RFC max length, adjust if needed
    .optional()
    .or(z.literal("")),
  position: z
    .string()
    .min(1, "Position is required.")
    .max(100, "Position must be at most 100 characters."),
  link: z
    .string()
    .min(1, "Link is required.")
    .url("Must be a valid URL.")
    .max(200, "Link must be at most 200 characters.")
    .or(z.literal("")),
  notes: z.string().optional(),
  location: z
    .string()
    .min(1, "Location is required.")
    .max(100, "Location must be at most 100 characters."),
  startSalary: z.coerce.number().min(1).max(1000),
  endSalary: z.coerce.number().min(1).max(1000),
  technologiesUsed: z
    .array(z.string().min(1, "Technology cannot be empty"))
    .optional(),
  contacts: z.string().optional(),
  deadline: z
    .date()
    .optional()
    .refine((val) => !val || val >= new Date(), {
      message: "Deadline must be in the future.",
    }),
  jobDescription: z.string().optional(),
  status: z.enum(
    applicationsStatusFilterOptionsConstant.map((o) => o.value) as [
      string,
      ...string[],
    ],
  ),
  type: z.enum(
    applicationsTypeFilterOptionsConstant.map((o) => o.value) as [
      string,
      ...string[],
    ],
  ),
  jobType: z.enum(
    applicationsJobTypeFilterOptionsConstant.map((o) => o.value) as [
      string,
      ...string[],
    ],
  ),
  level: z.enum(
    applicationsLevelFilterOptionsConstant.map((o) => o.value) as [
      string,
      ...string[],
    ],
  ),
});

export type ApplicationCreateRequestDto = z.infer<typeof formSchema>;

export interface ApplicationCreateFormProps {
  form: UseFormReturn<ApplicationCreateRequestDto>;
}
