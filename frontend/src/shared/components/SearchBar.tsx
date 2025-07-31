import { Search } from "lucide-react";
import { useEffect, useState } from "react";

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  debounce = 300,
  className = "",
}: SearchBarProps) {
  const [input, setInput] = useState(value);
  const debouncedInput = useDebouncedValue(input, debounce);

  useEffect(() => {
    onChange(debouncedInput);
  }, [debouncedInput]);

  useEffect(() => {
    setInput(value);
  }, [value]);

  return (
    <div
      className={`bg-card border-border focus-within:border-primary focus-within:ring-primary/20 flex items-center gap-3 rounded-md border px-3 py-2 focus-within:ring-1 ${className}`}
    >
      <Search className="text-muted-foreground h-4 w-4" />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="placeholder:text-muted-foreground flex-1 border-0 text-sm outline-none focus:border-0 focus:ring-0 focus:outline-none"
      />
    </div>
  );
}
