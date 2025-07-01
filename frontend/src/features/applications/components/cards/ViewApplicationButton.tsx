import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export function ViewApplicationButton() {
  return (
    <Button variant="outline" className="cursor-pointer">
      <Eye className="h-3 w-3" />
      <p>View</p>
    </Button>
  );
}
