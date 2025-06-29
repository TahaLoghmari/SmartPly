export interface NavItemState {
  activeNavItem:
    | "applications"
    | "contacts"
    | "documents"
    | "notifications"
    | "analytics"
    | "gmail"
    | "settings";
  setActiveNavItem: (
    item:
      | "applications"
      | "contacts"
      | "documents"
      | "notifications"
      | "analytics"
      | "gmail"
      | "settings",
  ) => void;
}

export interface GmailState {
  gmailState: "Gmail Connected" | "Gmail Not Connected";
  setGmailState: (state: "Gmail Connected" | "Gmail Not Connected") => void;
}

export interface NotificationsCount {
  notificationsCount: number;
  setNotificationsCount: (count: number) => void;
}

export interface SideBarState {
  activeState: boolean;
  setActiveState: (state: boolean) => void;
}
