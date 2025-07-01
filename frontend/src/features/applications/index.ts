import { useApplicationFiltersStore } from "./stores/useApplicationFiltersStore";

// Main components
export * from "./components/ApplicationsLayout";

// Card Components
export * from "./components/cards/ApplicationCard";
export * from "./components/cards/ApplicationCardsLayout";
export * from "./components/cards/TechnologiesUsed";
export * from "./components/cards/ViewApplicationButton";
export * from "./components/cards/EditApplicationButton";

// Filter Components
export * from "./components/filters/ApplicationClearFiltersButton";
export * from "./components/filters/ApplicationFilterBar";
export * from "./components/filters/ApplicationFiltersLayout";
export * from "./components/filters/ApplicationSearchBar";

// Stats Components
export * from "./components/stats/ApplicationStatCard";
export * from "./components/stats/ApplicationStatsLayout";

// Constants
export * from "./constants/applicationCardsConstants";
export * from "./constants/applicationFiltersConstants";

// hooks
export * from "./hooks/useApplicationFilters";
export * from "./hooks/useApplicationClearAllFilters";

// Filter Stores
export const useApplicationStatusFilterStore =
  useApplicationFiltersStore("All Status");
export const useApplicationTypeFilterStore =
  useApplicationFiltersStore("All Types");
export const useApplicationLevelFilterStore =
  useApplicationFiltersStore("All Levels");
export const useApplicationJobTypeFilterStore =
  useApplicationFiltersStore("All Job Types");

// Cards Store
export * from "./stores/useApplicationCardsStore";

// Stats Store
export * from "./stores/useApplicationStatsStore";

// Types
export * from "./types/applicationCardTypes";
export * from "./types/applicationFiltersTypes";
export * from "./types/applicationStatsTypes";
