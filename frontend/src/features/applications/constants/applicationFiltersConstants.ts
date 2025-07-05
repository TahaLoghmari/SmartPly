import {
  type ApplicationLevel,
  type ApplicationStatus,
  type ApplicationType,
  type ApplicationJobType,
  type ApplicationLevelLabel,
  type ApplicationStatusLabel,
  type ApplicationTypeLabel,
  type ApplicationJobTypeLabel,
} from "#/applications";

export const applicationsLevelFilterOptionsConstant: Readonly<
  {
    value: ApplicationLevel;
    label: ApplicationLevelLabel;
  }[]
> = [
  { value: "allLevels", label: "All Levels" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
] as const;

export const applicationsStatusFilterOptionsConstant: Readonly<
  {
    value: ApplicationStatus;
    label: ApplicationStatusLabel;
  }[]
> = [
  { value: "allStatus", label: "All Status" },
  { value: "wishList", label: "WishList" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "ghosted", label: "Ghosted" },
] as const;

export const applicationsTypeFilterOptionsConstant: Readonly<
  {
    value: ApplicationType;
    label: ApplicationTypeLabel;
  }[]
> = [
  { value: "allTypes", label: "All Types" },
  { value: "remote", label: "Remote" },
  { value: "onSite", label: "OnSite" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export const applicationsJobTypeFilterOptionsConstant: Readonly<
  {
    value: ApplicationJobType;
    label: ApplicationJobTypeLabel;
  }[]
> = [
  { value: "allJobTypes", label: "All Job Types" },
  { value: "fullTime", label: "Full Time" },
  { value: "partTime", label: "Part Time" },
  { value: "internship", label: "Internship" },
] as const;
