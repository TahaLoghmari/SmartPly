import {
  ApplicationStatsLayout,
  ApplicationFiltersLayout,
  ApplicationCardsLayout,
} from "#/applications";

export function ApplicationsLayout() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 transition-all duration-300">
      <ApplicationStatsLayout />
      <ApplicationFiltersLayout />
      <ApplicationCardsLayout />
    </div>
  );
}
