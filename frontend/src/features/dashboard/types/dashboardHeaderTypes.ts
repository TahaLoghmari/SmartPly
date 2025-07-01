export interface DashboardGmailStoreType {
  gmailState: "Gmail Connected" | "Gmail Not Connected";
  setGmailState: (state: "Gmail Connected" | "Gmail Not Connected") => void;
}

export interface DashboardNotificationsCountStoreType {
  notificationsCountState: number;
  setNotificationsCountState: (count: number) => void;
}
