import { Trash2, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { useDialogStore } from "#/dashboard";
import { ApplicationForm, type ApplicationPageProps } from "#/applications";

export function Actions({ applicationCard }: ApplicationPageProps) {
  const { openDialog, setOpenDialog } = useDialogStore();
  return (
    <div className="bg-card text-card-foreground flex min-w-70 flex-col gap-5 rounded-lg border p-6">
      <p className="text-2xl leading-none font-semibold tracking-tight">
        Actions
      </p>
      <div className="flex flex-col gap-3 pt-2">
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
        <Button
          variant="outline"
          className="text-destructive/80 border-destructive/20 hover:text-destructive hover:bg-destructive/5 dark:border-destructive/80 dark:hover:bg-destructive/5 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
