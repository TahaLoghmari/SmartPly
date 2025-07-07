import { Applications } from "#/applications";
import { Analytics } from "#/analytics";
import { Contacts } from "#/contacts";
import { Documents } from "#/documents";
import { Notifications } from "#/notifications";
import { Gmail } from "#/gmail";
import { Settings } from "#/settings";

export const dashboardSideBarNavigationComponentsConstant = {
  applications: Applications,
  analytics: Analytics,
  contacts: Contacts,
  documents: Documents,
  notifications: Notifications,
  gmail: Gmail,
  settings: Settings,
} as const;

export const dashboardNavigationTitlesConstant: Record<string, string> = {
  applications: "Job Applications",
  analytics: "Analytics Dashboard",
  contacts: "Contacts & Network",
  documents: "Documents",
  notifications: "Notifications",
  gmail: "Gmail",
  settings: "Settings",
} as const;
