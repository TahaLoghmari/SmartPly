import {
  type ApplicationRequestDto,
  type ApplicationResponseDto,
  type ApplicationStatusLabel,
} from "#/applications";
import type { UseFormReturn } from "react-hook-form";

export interface ApplicationCardProps {
  applicationCard: ApplicationResponseDto;
}

export type ApplicationFormProps =
  | {
      mutationType: "create";
      applicationCard?: undefined;
    }
  | {
      mutationType: "edit";
      applicationCard: ApplicationResponseDto;
    };

export interface ApplicationFormContentProps {
  form: UseFormReturn<ApplicationRequestDto>;
}

export interface TechnologiesUsedProps {
  technologies: string[];
  className?: string;
}

export interface ApplicationFilterBarProps<T> {
  selectedFilter: T | "";
  setSelectedFilter: (value: T) => void;
  applicationConstant: Readonly<{ value: T; label: string }[]>;
  name: string;
}

export interface ApplicationStatCardProps {
  value: number;
  label: ApplicationStatusLabel;
}

export interface ApplicationsButtonDeleteProps {
  onDelete: () => void;
  isLoading: boolean;
}

export interface ApplicationsStatusControlProps {
  applicationCard: ApplicationResponseDto;
  className?: string;
}

export interface ApplicationsPageStatusDateProps {
  applicationStatusDate: Date | undefined;
  step: string;
  id: string;
}

export interface ApplicationsFormHandleStatusChangeProps {
  credentials: ApplicationRequestDto;
  applicationCard?: ApplicationResponseDto | undefined;
}
