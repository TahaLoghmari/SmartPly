import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/index";
import { ApplicationForm } from "#/applications";

export function AddApplicationButton() {
  const { openDialog, setOpenDialog } = useDialogStore();
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
        <ApplicationForm mutationType="create" />
      </DialogContent>
    </Dialog>
  );
}
