import { cn } from "@/lib/utils";

export function Spinner({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <span
      className={cn(
        "h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black",
        className,
      )}
    />
  );
}
