import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { useManageApplicationStore } from "#/applications";
import { ApplicationsForm } from "#/applications";

export function ApplicationsButtonAdd() {
  const { openDialog, setOpenDialog } = useManageApplicationStore();
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="h-4 w-4" />
          <p>Add Application</p>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90vh] overflow-auto sm:max-w-4xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Application</DialogTitle>
        </DialogHeader>
        <ApplicationsForm mutationType="create" />
      </DialogContent>
    </Dialog>
  );
}
