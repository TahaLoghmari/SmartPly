import { z } from "zod";
import {
  applicationsStatusOptionsConstant,
  applicationsTypeOptionsConstant,
  applicationsJobTypeOptionsConstant,
  applicationsLevelOptionsConstant,
} from "#/applications";

export type ApplicationStatusLabel =
  | "WishList"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Ghosted";

export type ApplicationTypeLabel = "Remote" | "OnSite" | "Hybrid";

export type ApplicationLevelLabel = "Junior" | "Mid" | "Senior";

export type ApplicationJobTypeLabel = "Full Time" | "Part Time" | "Internship";

export type ApplicationStatus =
  | "wishList"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "ghosted";

export type ApplicationType = "remote" | "onSite" | "hybrid";

export type ApplicationLevel = "junior" | "mid" | "senior";

export type ApplicationJobType = "fullTime" | "partTime" | "internship";

export const formSchema = z
  .object({
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
      } = data;
      if (wishListDate && appliedDate && !(wishListDate < appliedDate))
        return false;
      if (appliedDate && interviewDate && !(appliedDate < interviewDate))
        return false;
      if (interviewDate && offerDate && !(interviewDate < offerDate))
        return false;
      if (offerDate && rejectedDate && !(offerDate <= rejectedDate))
        return false;

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
      ],
    },
  );

export type ApplicationRequestDto = z.infer<typeof formSchema>;

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
  wishListDate: Date | null;
  appliedDate: Date | null;
  interviewDate: Date | null;
  offerDate: Date | null;
  rejectedDate: Date | null;
  ghostedDate: Date | null;
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

export type ApplicationFormProps =
  | {
      mutationType: "create";
      applicationCard?: null;
    }
  | {
      mutationType: "edit";
      applicationCard: ApplicationResponseDto;
    };

export interface TechnologiesUsedProps {
  technologies: string[];
  className?: string;
}

export interface ApplicationFilterStoreType<T> {
  selectedFilter: T;
  setSelectedFilter: (value: T) => void;
  clear: () => void;
}

export interface ApplicationFilterBarProps<T> {
  selectedFilter: T;
  setSelectedFilter: (value: T) => void;
  applicationConstant: Readonly<{ value: T; label: string }[]>;
  name: string;
}

export interface ApplicationSearchBarStore {
  search: string;
  setSearch: (value: string) => void;
  clear: () => void;
}

export interface ApplicationPageNavigationStore {
  navigationPage: string;
  setNavigationPage: (page: string) => void;
}

export interface ApplicationStatCardProps {
  value: number;
  label: ApplicationStatusLabel;
}

export interface ApplicationPageProps {
  applicationCard: ApplicationResponseDto;
}

export interface ApplicationQueryParameters {
  status: ApplicationStatus;
  type: ApplicationType;
  level: ApplicationLevel;
  jobType: ApplicationJobType;
  search: string;
  page: number;
  pageSize: number;
}

export interface PaginationResult {
  items: ApplicationResponseDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ManageApplicationStore {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

export interface JsonPatchOp {
  op: "add" | "remove" | "replace" | "move" | "copy" | "test";
  path: string;
  value?: any;
}
