import { IconSettings } from "@tabler/icons-react";
import { Inbox, ClipboardList, FileText } from "lucide-react";

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
        title: "Documents",
        url: "documents",
        icon: FileText,
      },
      {
        title: "Inbox",
        url: "inbox",
        icon: Inbox,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "settings",
        icon: IconSettings,
      },
    ],
  };
}
