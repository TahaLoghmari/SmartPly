import { IconFileAnalytics, IconSettings } from "@tabler/icons-react";
import {
  Mail,
  ClipboardList,
  Users,
  FileText,
  Sparkles,
} from "lucide-react";

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
