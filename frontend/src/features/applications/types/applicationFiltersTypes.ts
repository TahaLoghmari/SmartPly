export interface ApplicationFilterStoreType<T> {
  isFilterOpen: boolean;
  selectedFilter: T;
  setIsFilterOpen: (open: boolean) => void;
  setSelectedFilter: (value: T) => void;
  clear: () => void;
}

export interface ApplicationFilterBarProps<T> {
  isFilterOpen: boolean;
  selectedFilter: T;
  setIsFilterOpen: (open: boolean) => void;
  setSelectedFilter: (value: T) => void;
  applicationConstant: Readonly<{ value: T; label: string }[]>;
  name: string;
}
