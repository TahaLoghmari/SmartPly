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
