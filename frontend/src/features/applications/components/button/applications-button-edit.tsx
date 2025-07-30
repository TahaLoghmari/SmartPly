import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { SquarePen } from "lucide-react";
import { ApplicationsForm, type ApplicationCardProps } from "#/applications";
import { useManageApplicationStore } from "#/applications";
import { Button } from "@/components/ui/button";

export function ApplicationsButtonEdit({
  applicationCard,
}: ApplicationCardProps) {
  const { openDialog, setOpenDialog } = useManageApplicationStore();
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-primary flex w-23 cursor-pointer items-center"
        >
          <SquarePen className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90vh] overflow-auto sm:max-w-4xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Application</DialogTitle>
        </DialogHeader>
        <ApplicationsForm
          mutationType="edit"
          applicationCard={applicationCard}
        />
      </DialogContent>
    </Dialog>
  );
}
