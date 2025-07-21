import { Applications } from "#/applications";
import { Analytics } from "#/analytics";
import { Contacts } from "#/contacts";
import { Documents } from "#/documents";
import { Notifications } from "#/notifications";
import { Gmail } from "#/gmail";
import { Settings } from "#/settings";
import { IconFileAnalytics, IconSettings } from "@tabler/icons-react";
import { Mail, ClipboardList, Users, FileText, Sparkles } from "lucide-react";

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

export function getNavigationData(user: {
  name: string;
  email: string;
  imageUrl: string;
}) {
  return {
    user: {
      name: user!.name,
      email: user!.email,
      avatar: user!.imageUrl,
    },
    navMain: [
      {
        title: "Applications",
        url: "applications",
        icon: ClipboardList,
      },
      {
        title: "Analytics",
        url: "analytics",
        icon: IconFileAnalytics,
      },
      {
        title: "Contacts",
        url: "contacts",
        icon: Users,
      },
      {
        title: "Documents",
        url: "documents",
        icon: FileText,
      },
      {
        title: "Gmail",
        url: "gmail",
        icon: Mail,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: IconSettings,
      },
      {
        title: "AI",
        url: "#",
        icon: Sparkles,
      },
    ],
  };
}
