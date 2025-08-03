import z from "zod";
import {
  APPLICATIONS_JOB_TYPE_OPTIONS,
  APPLICATIONS_LEVEL_OPTIONS,
  APPLICATIONS_STATUS_OPTIONS,
  APPLICATIONS_TYPE_OPTIONS,
} from "#/applications";

export const ApplicationsFormRequestSchema = z
  .object({
    userId: z
      .string()
      .min(1, "UserId is required.")
      .max(100, "UserId must be at most 100 characters."),
    resumeId: z.string().optional(),
    coverLetterId: z.string().optional(),
    companyName: z
      .string()
      .min(1, "Company name is required.")
      .max(100, "Company name must be at most 100 characters."),
    companyEmail: z
      .string()
      .email("CompanyEmail must be a valid email address.")
      .max(320, "CompanyEmail must be at most 320 characters.")
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
    isLiked: z.boolean(),
    technologiesUsed: z
      .array(z.string().min(1, "Technology cannot be empty"))
      .optional(),
    deadline: z.date().optional(),
    jobDescription: z.string().optional(),
    status: z.enum(
      APPLICATIONS_STATUS_OPTIONS.map((o) => o.value) as [string, ...string[]],
    ),
    type: z.enum(
      APPLICATIONS_TYPE_OPTIONS.map((o) => o.value) as [string, ...string[]],
    ),
    jobType: z.enum(
      APPLICATIONS_JOB_TYPE_OPTIONS.map((o) => o.value) as [
        string,
        ...string[],
      ],
    ),
    level: z.enum(
      APPLICATIONS_LEVEL_OPTIONS.map((o) => o.value) as [string, ...string[]],
    ),
    wishListDate: z.date().optional(),
    appliedDate: z.date().optional(),
    interviewDate: z.date().optional(),
    offerDate: z.date().optional(),
    rejectedDate: z.date().optional(),
    ghostedDate: z.date().optional(),
  })
  .refine(
    (data) => {
      const {
        wishListDate,
        appliedDate,
        interviewDate,
        offerDate,
        rejectedDate,
        ghostedDate,
      } = data;
      if (wishListDate && appliedDate && !(wishListDate <= appliedDate))
        return false;
      if (appliedDate && interviewDate && !(appliedDate <= interviewDate))
        return false;
      if (interviewDate && offerDate && !(interviewDate <= offerDate))
        return false;
      if (offerDate && rejectedDate && !(offerDate <= rejectedDate))
        return false;
      if (offerDate && ghostedDate && !(offerDate <= ghostedDate)) return false;

      return true;
    },
    {
      message:
        "Date order must be: wishListDate < appliedDate < interviewDate < offerDate <= rejectedDate (if present)",
      path: [
        "wishListDate",
        "appliedDate",
        "interviewDate",
        "offerDate",
        "rejectedDate",
        "ghostedDate",
      ],
    },
  );
