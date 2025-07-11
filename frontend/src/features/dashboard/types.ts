export interface DashboardNotificationsCountStoreType {
  notificationsCountState: number;
  setNotificationsCountState: (count: number) => void;
}

export interface DialogStore {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

export interface DashboardActiveNavItemStoreType {
  activeNavItemState:
    | "applications"
    | "contacts"
    | "documents"
    | "notifications"
    | "analytics"
    | "gmail"
    | "settings";
  setActiveNavItemState: (
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

export interface DashboardSideBarStoreType {
  activeState: boolean;
  setActiveState: (state: boolean) => void;
}

export interface DashboardTitleStoreType {
  dashboardTitleState: string;
  setDashboardTitleState: (state: string) => void;
}
