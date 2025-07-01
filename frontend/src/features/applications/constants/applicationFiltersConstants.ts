import {
  type ApplicationLevel,
  type ApplicationStatus,
  type ApplicationType,
  type ApplicationJobType,
} from "#/applications";

export const applicationsLevelFilterOptionsConstant: Readonly<
  {
    value: ApplicationLevel;
    label: ApplicationLevel;
  }[]
> = [
  { value: "All Levels", label: "All Levels" },
  { value: "Junior", label: "Junior" },
  { value: "Mid", label: "Mid" },
  { value: "Senior", label: "Senior" },
] as const;

export const applicationsStatusFilterOptionsConstant: Readonly<
  {
    value: ApplicationStatus;
    label: ApplicationStatus;
  }[]
> = [
  { value: "All Status", label: "All Status" },
  { value: "WishList", label: "WishList" },
  { value: "Applied", label: "Applied" },
  { value: "Interviewing", label: "Interviewing" },
  { value: "Offer", label: "Offer" },
  { value: "Rejected", label: "Rejected" },
  { value: "Ghosted", label: "Ghosted" },
] as const;

export const applicationsTypeFilterOptionsConstant: Readonly<
  {
    value: ApplicationType;
    label: ApplicationType;
  }[]
> = [
  { value: "All Types", label: "All Types" },
  { value: "Remote", label: "Remote" },
  { value: "OnSite", label: "OnSite" },
  { value: "Hybrid", label: "Hybrid" },
] as const;

export const applicationsJobTypeFilterOptionsConstant: Readonly<
  {
    value: ApplicationJobType;
    label: ApplicationJobType;
  }[]
> = [
  { value: "All Job Types", label: "All Job Types" },
  { value: "Full Time", label: "Full Time" },
  { value: "Part Time", label: "Part Time" },
  { value: "Internship", label: "Internship" },
] as const;
