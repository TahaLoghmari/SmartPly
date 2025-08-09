import { Button } from "@/components/ui/button";
import { useApplicationClearFilters } from "#/applications";

export default function ApplicationClearFiltersButton() {
  const clearAll = useApplicationClearFilters();
  return (
    <Button
      variant="ghost"
      className="bg-card hover:bg-accent border duration-0"
      onClick={clearAll}
    >
      Clear Filters
    </Button>
  );
}
