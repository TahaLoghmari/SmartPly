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

export default function EditButton({ applicationCard }: ApplicationCardProps) {
  const { openDialog, setOpenDialog } = useApplicationFormDialogStore();
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
        <ApplicationForm
          mutationType="edit"
          applicationCard={applicationCard}
        />
      </DialogContent>
    </Dialog>
  );
}
