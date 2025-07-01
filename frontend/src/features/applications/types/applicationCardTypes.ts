// Contacts, Job Description, resumeUsed, coverLetterUsed, are shown When you click on the card
export interface ApplicationCardType {
  id: string;
  companyName: string;
  companyEmail: string;
  position: string;
  link: string;
  status: string;
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
  type: string;
  jobType: string;
  level: string;
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
