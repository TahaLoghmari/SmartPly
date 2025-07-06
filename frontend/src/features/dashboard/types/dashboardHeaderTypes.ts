export interface DashboardNotificationsCountStoreType {
  notificationsCountState: number;
  setNotificationsCountState: (count: number) => void;
}

export interface AddApplicationDialogStore {
  addApplicationOpen: boolean;
  setAddApplicationOpen: (open: boolean) => void;
}
