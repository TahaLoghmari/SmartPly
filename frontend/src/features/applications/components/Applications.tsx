import {
  ApplicationStats,
  ApplicationFilters,
  ApplicationCards,
} from "#/applications";

export function Applications() {
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-auto p-6 transition-all duration-300">
      <ApplicationStats />
      <ApplicationFilters />
      <ApplicationCards />
    </div>
  );
}
