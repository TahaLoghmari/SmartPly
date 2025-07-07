import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApplicationCreatePage } from "#/applications";
import { useAddApplicationDialogStore } from "#/dashboard";

export function AddApplicationButton() {
  const { addApplicationOpen, setAddApplicationOpen } =
    useAddApplicationDialogStore();
  return (
    <Dialog open={addApplicationOpen} onOpenChange={setAddApplicationOpen}>
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
        <ApplicationCreatePage />
      </DialogContent>
    </Dialog>
  );
}
