import { Plus } from "lucide-react";

export function AddApplicationButton() {
  return (
    <div className="text-primary-foreground bg-primary flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all">
      <Plus className="h-4 w-4" />
      <p>Add Application</p>
    </div>
  );
}
