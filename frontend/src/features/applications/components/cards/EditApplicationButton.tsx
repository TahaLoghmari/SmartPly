import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EditApplicationButton() {
  return (
    <Button variant="outline" className="cursor-pointer">
      <SquarePen className="h-3 w-3" />
      <p>Edit</p>
    </Button>
  );
}
