import type z from "zod";
import {
  ApplicationsFormRequestSchema,
  type ApplicationJobType,
  type ApplicationLevel,
  type ApplicationStatus,
  type ApplicationType,
} from "#/applications";
import type { JsonPatchDto } from "@/index";

export type ApplicationRequestDto = z.infer<
  typeof ApplicationsFormRequestSchema
>;

export interface ApplicationResponseDto {
  id: string;
  resumeId: string;
  coverLetterId: string | undefined;
  userId: string;
  companyName: string;
  companyEmail: string | undefined;
  position: string;
  link: string;
  notes: string | undefined;
  location: string;
  jobDescription: string | undefined;
  startSalary: number;
  endSalary: number;
  isLiked: boolean;
  deadline: Date | undefined;
  createdAt: Date;
  updatedAt: Date | undefined;
  wishListDate: Date | undefined;
  appliedDate: Date | undefined;
  interviewDate: Date | undefined;
  offerDate: Date | undefined;
  rejectedDate: Date | undefined;
  ghostedDate: Date | undefined;
  status: ApplicationStatus;
  type: ApplicationType;
  jobType: ApplicationJobType;
  level: ApplicationLevel;
  technologiesUsed: string[] | undefined;
}

export interface ApplicationGetRequestDto {
  id: string;
}

export interface ApplicationQueryParametersDto {
  status: ApplicationStatus;
  type: ApplicationType;
  level: ApplicationLevel;
  jobType: ApplicationJobType;
  search: string;
  page: number;
  pageSize: number;
}

export interface ApplicationPatchRequestDto {
  id: string;
  patch: JsonPatchDto[];
}

export interface ApplicationEditRequestDto {
  id: string;
  data: ApplicationRequestDto;
}
