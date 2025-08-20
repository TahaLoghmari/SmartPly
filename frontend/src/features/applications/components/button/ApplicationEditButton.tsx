import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { SquarePen } from "lucide-react";
import { ApplicationForm, type ApplicationCardProps } from "#/applications";
import { useApplicationFormDialogStore } from "#/applications";
import { Button } from "@/components/ui/button";

export default function ApplicationEditButton({
  applicationCard,
}: ApplicationCardProps) {
  const { openDialog, setOpenDialog } = useApplicationFormDialogStore();
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-primary flex w-fit cursor-pointer items-center lg:w-23"
        >
          <SquarePen className="h-4 w-4" />
          <span className="hidden lg:inline">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90vh] overflow-auto sm:max-w-4xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Application</DialogTitle>
        </DialogHeader>
        <ApplicationForm
          mutationType="edit"
          applicationCard={applicationCard}
        />
      </DialogContent>
    </Dialog>
  );
}
