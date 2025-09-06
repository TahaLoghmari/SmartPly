import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { useApplicationFormDialogStore } from "#/applications";
import { ApplicationForm } from "#/applications";
import { useCurrentScreenSize } from "@/hooks";

export default function ApplicationAddButton() {
  const { currentScreenSize } = useCurrentScreenSize();

  const { openDialog, setOpenDialog } = useApplicationFormDialogStore();
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="flex cursor-pointer items-center justify-center rounded-md lg:p-4!">
          <Plus className="h-4 w-4" />
          {currentScreenSize >= 1024 && <p>Add Application</p>}
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
