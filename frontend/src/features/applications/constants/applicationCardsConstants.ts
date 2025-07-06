import { type ApplicationStatusLabel } from "#/applications";

export const ApplicationStatusToColor: Record<ApplicationStatusLabel, string> =
  {
    "All Status": "hidden",
    Interviewing: "bg-yellow-100 text-yellow-800",
    Applied: "bg-blue-100 text-blue-800",
    Rejected: "bg-red-100 text-red-800",
    Ghosted: "bg-gray-100 text-gray-800",
    Offer: "bg-green-100 text-green-800",
    WishList: "bg-purple-100 text-purple-800",
  };
