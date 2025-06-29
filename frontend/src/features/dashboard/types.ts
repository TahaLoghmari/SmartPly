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
