export interface ResumeSearchbarStore {
  search: string;
  setSearch: (value: string) => void;
  clear: () => void;
}

export interface SelectedResumesStore<T> {
  selected: T[];
  setSelected: (rows: T[]) => void;
  clearSelected: () => void;
}
