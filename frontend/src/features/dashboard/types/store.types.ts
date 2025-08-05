export interface DashboardNotificationsCountStore {
  notificationsCountState: number;
  setNotificationsCountState: (count: number) => void;
}

export interface LogoutDialogStore {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

export interface DashboardSidebarStateStore {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (state: boolean) => void;
}
