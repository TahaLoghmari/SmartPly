import {
  type ApplicationStatus,
  type ApplicationType,
  type ApplicationJobType,
  type ApplicationLevel,
} from "#/applications";

export interface ApplicationCardType {
  id: string;
  companyName: string;
  companyEmail: string;
  position: string;
  link: string;
  status: ApplicationStatus;
  notes: string;
  location: string;
  startSalary: number;
  endSalary: number;
  technologiesUsed: string[];
  contacts: string;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  jobDescription: string;
  resumeUsed: string;
  coverLetterUsed: string;
  type: ApplicationType;
  jobType: ApplicationJobType;
  level: ApplicationLevel;
}

export interface ApplicationCardStoreType {
  applicationCardsState: ApplicationCardType[];
  setApplicationCardsState: (cards: ApplicationCardType[]) => void;
}

export interface ApplicationCardProps {
  applicationCard: ApplicationCardType;
}

export interface TechnologiesUsedProps {
  technologies: string[];
}
