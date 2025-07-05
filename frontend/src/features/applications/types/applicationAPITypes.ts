import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";
import {
  applicationsStatusFilterOptionsConstant,
  applicationsTypeFilterOptionsConstant,
  applicationsJobTypeFilterOptionsConstant,
  applicationsLevelFilterOptionsConstant,
} from "#/applications";

export const formSchema = z.object({
  resumeId: z.string().min(1, "Resume is required"),
  coverLetterId: z.string().optional(),
  userId: z.string(),
  companyName: z.string().min(1, "Company name is required."),
  companyEmail: z
    .string()
    .email("Invalid email format.")
    .optional()
    .or(z.literal("")),
  position: z.string().min(1, "Position is required."),
  link: z.string().url("Must be a valid URL.").or(z.literal("")),
  notes: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  startSalary: z.number(),
  endSalary: z.number(),
  technologiesUsed: z.array(z.string()).optional(),
  contacts: z.string().optional(),
  deadline: z.date().optional(),
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
