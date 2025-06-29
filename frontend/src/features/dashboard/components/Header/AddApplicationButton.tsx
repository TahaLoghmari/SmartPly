import { Plus } from "lucide-react";

export function AddApplicationButton() {
  return (
    <div className="text-primary-foreground flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#6c79e1] to-[#7057b0] px-4 py-2 text-sm font-medium transition-all hover:from-[#5a67d8] hover:to-[#6348a3]">
      <Plus className="h-4 w-4" />
      <p>Add Application</p>
    </div>
  );
}
