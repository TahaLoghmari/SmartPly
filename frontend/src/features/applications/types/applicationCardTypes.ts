import {
  type ApplicationStatus,
  type ApplicationType,
  type ApplicationJobType,
  type ApplicationLevel,
} from "#/applications";

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

export interface ApplicationStoreType {
  applicationCardsState: ApplicationResponseDto[];
  setApplicationCardsState: (cards: ApplicationResponseDto[]) => void;
}

export interface ApplicationCardProps {
  applicationCard: ApplicationResponseDto;
}

export interface TechnologiesUsedProps {
  technologies: string[];
}
