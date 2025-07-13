import { Search } from "lucide-react";
import { useApplicationSearchBarStore } from "#/applications";
import { useEffect, useState } from "react";

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export function ApplicationSearchBar() {
  const { search, setSearch } = useApplicationSearchBarStore();
  const [input, setInput] = useState(search);
  const debouncedInput = useDebouncedValue(input, 300);
  
  useEffect(() => {
    setSearch(debouncedInput);
  }, [debouncedInput, setSearch]);

  return (
    <div className="border-border focus-within:border-primary focus-within:ring-primary/20 flex w-sm items-center gap-3 rounded-md border px-3 py-2 focus-within:ring-1">
      <Search className="text-muted-foreground h-4 w-4" />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search jobs, companies ..."
        className="placeholder:text-muted-foreground flex-1 border-0 text-sm outline-none focus:border-0 focus:ring-0 focus:outline-none"
      />
    </div>
  );
}
