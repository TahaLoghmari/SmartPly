import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";
import {
  applicationsStatusOptionsConstant,
  applicationsTypeOptionsConstant,
  applicationsJobTypeOptionsConstant,
  applicationsLevelOptionsConstant,
} from "#/applications";

export type ApplicationStatusLabel =
  | "All Status"
  | "WishList"
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Rejected"
  | "Ghosted";

export type ApplicationTypeLabel = "All Types" | "Remote" | "OnSite" | "Hybrid";

export type ApplicationLevelLabel = "All Levels" | "Junior" | "Mid" | "Senior";

export type ApplicationJobTypeLabel =
  | "Full Time"
  | "Part Time"
  | "Internship"
  | "All Job Types";

export type ApplicationStatus =
  | "allStatus"
  | "wishList"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "ghosted";

export type ApplicationType = "allTypes" | "remote" | "onSite" | "hybrid";

export type ApplicationLevel = "allLevels" | "junior" | "mid" | "senior";

export type ApplicationJobType =
  | "fullTime"
  | "partTime"
  | "internship"
  | "allJobTypes";

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
    applicationsStatusOptionsConstant.map((o) => o.value) as [
      string,
      ...string[],
    ],
  ),
  type: z.enum(
    applicationsTypeOptionsConstant.map((o) => o.value) as [
      string,
      ...string[],
    ],
  ),
  jobType: z.enum(
    applicationsJobTypeOptionsConstant.map((o) => o.value) as [
      string,
      ...string[],
    ],
  ),
  level: z.enum(
    applicationsLevelOptionsConstant.map((o) => o.value) as [
      string,
      ...string[],
    ],
  ),
});

export type ApplicationCreateRequestDto = z.infer<typeof formSchema>;

export interface ApplicationCreateFormProps {
  form: UseFormReturn<ApplicationCreateRequestDto>;
}

export interface ApplicationGetRequestDto {
  id: string;
}

export interface ApplicationResponseDto {
  id: string;
  resumeId: string;
  coverLetterId: string | null;
  userId: string;

  companyName: string;
  companyEmail: string | null;
  position: string;
  link: string;
  notes: string | null;
  location: string;
  startSalary: number;
  endSalary: number;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  jobDescription: string | null;
  status: ApplicationStatus;
  type: ApplicationType;
  jobType: ApplicationJobType;
  level: ApplicationLevel;
  technologiesUsed: string[] | null;
}

export interface ApplicationCardProps {
  applicationCard: ApplicationResponseDto;
}

export interface TechnologiesUsedProps {
  technologies: string[];
}

export interface ApplicationFilterStoreType<T> {
  isFilterOpen: boolean;
  selectedFilter: T;
  setIsFilterOpen: (open: boolean) => void;
  setSelectedFilter: (value: T) => void;
  clear: () => void;
}

export interface ApplicationFilterBarProps<T> {
  isFilterOpen: boolean;
  selectedFilter: T;
  setIsFilterOpen: (open: boolean) => void;
  setSelectedFilter: (value: T) => void;
  applicationConstant: Readonly<{ value: T; label: string }[]>;
  name: string;
}

export interface StatsState {
  wishListCount: number;
  appliedCount: number;
  interviewingCount: number;
  offerCount: number;
  rejectedCount: number;
  ghostedCount: number;
  setWishListCount: (count: number) => void;
  setAppliedCount: (count: number) => void;
  setInterviewingCount: (count: number) => void;
  setOfferCount: (count: number) => void;
  setRejectedCount: (count: number) => void;
  setGhostedCount: (count: number) => void;
}

export interface ApplicationStatCardProps {
  value: number;
  label: ApplicationStatusLabel;
}
