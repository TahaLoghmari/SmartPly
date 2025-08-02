export interface ApplicationFilterStore<T> {
  selectedFilter: T | "";
  setSelectedFilter: (value: T | "") => void;
  clear: () => void;
}

export interface ApplicationSearchBarStore {
  search: string;
  setSearch: (value: string) => void;
  clear: () => void;
}

export interface ApplicationPageNavigationStore {
  navigationPage: string;
  setNavigationPage: (page: string) => void;
}

export interface ApplicationFormDialogStore {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

export interface ApplicationManageJobsStore {
  isSelecting: boolean;
  selectedApplications: string[];
  setIsSelecting: (isSelecting: boolean) => void;
  setSelectedApplications: (selectedApplications: string[]) => void;
  addApplication: (id: string) => void;
  removeApplication: (id: string) => void;
  clearSelectedApplications: () => void;
}
