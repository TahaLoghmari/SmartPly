export interface LogoutDialogStore {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

export interface DashboardSidebarStateStore {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (state: boolean) => void;
}

export interface DashboardInboxStateStore {
  isInboxOpen: boolean;
  setIsInboxOpen: (state: boolean) => void;
}
