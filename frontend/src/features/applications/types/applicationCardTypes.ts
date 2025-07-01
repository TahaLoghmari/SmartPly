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
  salary: string;
  frameworksOrLanguagesUsed: string;
  contacts: string;
  deadline: string;
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
