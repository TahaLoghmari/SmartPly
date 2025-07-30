import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteResume } from "#/documents";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export function DeleteAction({ resumeId }: { resumeId: string }) {
  const deleteResumeMutation = useDeleteResume();
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          className="text-muted-foreground hover:text-primary flex h-[18px] w-[18px] cursor-pointer items-center justify-center"
        >
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
        </svg>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Resume</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this resume? You won't be able to
            undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteResumeMutation.mutate(resumeId, {
                onSuccess: () => setOpen(false),
              })
            }
          >
            {deleteResumeMutation.isPending ? (
              <Spinner className="h-8 w-auto invert dark:invert-0" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
