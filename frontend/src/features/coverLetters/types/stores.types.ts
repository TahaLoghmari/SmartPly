export interface CoverLetterSearchbarStore {
  search: string;
  setSearch: (value: string) => void;
  clear: () => void;
}

export interface SelectedCoverLettersStore<T> {
  selected: T[];
  setSelected: (rows: T[]) => void;
  clearSelected: () => void;
}
