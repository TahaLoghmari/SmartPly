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
  | "ghosted"
  | "";

export type ApplicationType = "remote" | "onSite" | "hybrid" | "";

export type ApplicationLevel = "junior" | "mid" | "senior" | "";

export type ApplicationJobType = "fullTime" | "partTime" | "internship" | "";
