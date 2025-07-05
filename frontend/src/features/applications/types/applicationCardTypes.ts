import {
  type ApplicationStatusLabel,
  type ApplicationTypeLabel,
  type ApplicationJobTypeLabel,
  type ApplicationLevelLabel,
} from "#/applications";

export interface ApplicationCreateResponseDto {
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
  status: ApplicationStatusLabel;
  type: ApplicationTypeLabel;
  jobType: ApplicationJobTypeLabel;
  level: ApplicationLevelLabel;
  technologiesUsed: string[] | null;
}

export interface ApplicationStoreType {
  applicationCardsState: ApplicationCreateResponseDto[];
  setApplicationCardsState: (cards: ApplicationCreateResponseDto[]) => void;
}

export interface ApplicationCardProps {
  applicationCard: ApplicationCreateResponseDto;
}

export interface TechnologiesUsedProps {
  technologies: string[];
}
