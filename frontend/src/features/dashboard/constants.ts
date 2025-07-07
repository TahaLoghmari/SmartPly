import { Applications } from "#/applications";
import { AnalyticsLayout } from "#/analytics";
import { ContactsLayout } from "#/contacts";
import { DocumentsLayout } from "#/documents";
import { NotificationsLayout } from "#/notifications";
import { GmailLayout } from "#/gmail";
import { SettingsLayout } from "#/settings";

export const dashboardSideBarNavigationComponentsConstant = {
  applications: Applications,
  analytics: AnalyticsLayout,
  contacts: ContactsLayout,
  documents: DocumentsLayout,
  notifications: NotificationsLayout,
  gmail: GmailLayout,
  settings: SettingsLayout,
} as const;

export const dashboardHeaderNavigationTitlesConstant = {
  applications: "Job Applications",
  analytics: "Analytics Dashboard",
  contacts: "Contacts & Network",
  documents: "Documents",
  notifications: "Notifications",
  gmail: "Gmail",
  settings: "Settings",
} as const;
