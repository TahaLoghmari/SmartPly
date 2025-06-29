export interface NavItemState {
  activeNavItem:
    | "dashboard"
    | "applications"
    | "gmail"
    | "resumes"
    | "settings";
  setActiveNavItem: (
    item: "dashboard" | "applications" | "gmail" | "resumes" | "settings",
  ) => void;
}

export interface GmailState {
  gmailState: "Gmail Connected" | "Gmail Not Connected";
  setGmailState: (state: "Gmail Connected" | "Gmail Not Connected") => void;
}

export interface NotificationsCount {
  notificationsCount : number ; 
  setNotificationsCount: (count : number ) => void ; 
}