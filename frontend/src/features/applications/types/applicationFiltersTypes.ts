export interface ApplicationFilterStoreType {
  isFilterOpen: boolean;
  selectedFilter: string;
  setIsFilterOpen: (open: boolean) => void;
  setSelectedFilter: (value: string) => void;
  clear: () => void;
}

export interface ApplicationFilterBarProps {
  isFilterOpen: boolean;
  selectedFilter: string;
  setIsFilterOpen: (open: boolean) => void;
  setSelectedFilter: (value: string) => void;
  applicationConstant: Array<{ value: string; label: string }>;
  name: string;
}
