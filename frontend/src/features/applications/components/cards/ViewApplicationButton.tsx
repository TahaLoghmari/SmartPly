import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export function ViewApplicationButton() {
  return (
    <Button variant="outline" className="flex-1 cursor-pointer">
      <Eye className="h-3 w-3" />
      <p>View</p>
    </Button>
  );
}
