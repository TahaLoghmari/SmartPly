import { Search } from "lucide-react";

export function Searchbar() {
  return (
    <div className="flex w-md items-center gap-3 rounded-md border border-gray-300 px-3 py-2 focus-within:border-gray-300 focus-within:ring-3 focus-within:ring-gray-200">
      <Search className="h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search jobs, companies or recruiters..."
        className="flex-1 border-0 text-sm outline-none placeholder:text-gray-500 focus:border-0 focus:ring-0 focus:outline-none"
      />
    </div>
  );
}
