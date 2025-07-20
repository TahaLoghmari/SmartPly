import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { SquarePen } from "lucide-react";
import { ApplicationForm, type ApplicationPageProps } from "#/applications";
import { useManageApplicationStore } from "#/applications";
import { Button } from "@/components/ui/button";

export function EditApplicationButton({
  applicationCard,
}: ApplicationPageProps) {
  const { openDialog, setOpenDialog } = useManageApplicationStore();
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
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
