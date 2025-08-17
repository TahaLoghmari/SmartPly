import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useDeleteCurrentUser } from "#/settings";

export function SettingsDeleteAccountButton() {
  const deleteCurrentUserMutation = useDeleteCurrentUser();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="text-destructive/80 border-destructive/80 hover:text-destructive hover:bg-destructive/5 flex w-[156px] cursor-pointer items-center self-end"
        >
          {deleteCurrentUserMutation.isPending ? (
            <span className="border-destructive inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-t-transparent"></span>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Account
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteCurrentUserMutation.mutate()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
