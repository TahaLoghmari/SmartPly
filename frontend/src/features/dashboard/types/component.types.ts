import type { Icon } from "@tabler/icons-react";

export interface SidebarNavProps {
  items: {
    title: string;
    url: string;
    icon: Icon | React.ElementType;
  }[];
}

export interface SidebarNavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}
