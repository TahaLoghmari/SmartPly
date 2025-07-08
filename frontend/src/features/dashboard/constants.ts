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
  Applications: "Job Applications",
  Analytics: "Analytics Dashboard",
  Contacts: "Contacts & Network",
  Documents: "Documents",
  Notifications: "Notifications",
  Gmail: "Gmail",
  Settings: "Settings",
} as const;
