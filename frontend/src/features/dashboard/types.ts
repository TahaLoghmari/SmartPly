export interface DashboardNavItemState {
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

export interface DashboardGmailState {
  gmailState: "Gmail Connected" | "Gmail Not Connected";
  setGmailState: (state: "Gmail Connected" | "Gmail Not Connected") => void;
}

export interface DashboardNotificationsCount {
  notificationsCount: number;
  setNotificationsCount: (count: number) => void;
}

export interface DashboardSideBarState {
  activeState: boolean;
  setActiveState: (state: boolean) => void;
}
