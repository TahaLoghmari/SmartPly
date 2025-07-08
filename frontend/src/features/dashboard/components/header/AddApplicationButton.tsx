import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AddApplicationButton() {
  return (
    <Link to="/app/applications/add">
      <Button className="cursor-pointer">
        <Plus className="h-4 w-4" />
        <p>Add Application</p>
      </Button>
    </Link>
  );
}
