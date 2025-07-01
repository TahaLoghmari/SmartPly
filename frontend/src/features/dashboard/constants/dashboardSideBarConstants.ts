import { ApplicationsLayout } from "#/applications";
import { AnalyticsLayout } from "#/analytics";
import { ContactsLayout } from "#/contacts";
import { DocumentsLayout } from "#/documents";
import { NotificationsLayout } from "#/notifications";
import { GmailLayout } from "#/gmail";
import { SettingsLayout } from "#/settings";

export const dashboardSideBarNavigationComponentsConstant = {
  applications: ApplicationsLayout,
  analytics: AnalyticsLayout,
  contacts: ContactsLayout,
  documents: DocumentsLayout,
  notifications: NotificationsLayout,
  gmail: GmailLayout,
  settings: SettingsLayout,
} as const;
