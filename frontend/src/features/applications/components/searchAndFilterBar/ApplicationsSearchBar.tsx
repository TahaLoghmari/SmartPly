import { Search } from "lucide-react";

export function ApplicationsSearchBar() {
  return (
    <div className="border-border focus-within:border-primary focus-within:ring-primary/20 flex w-sm items-center gap-3 rounded-md border px-3 py-2 focus-within:ring-1">
      <Search className="text-muted-foreground h-4 w-4" />
      <input
        type="text"
        placeholder="Search jobs, companies ..."
        className="placeholder:text-muted-foreground flex-1 border-0 text-sm outline-none focus:border-0 focus:ring-0 focus:outline-none"
      />
    </div>
  );
}
