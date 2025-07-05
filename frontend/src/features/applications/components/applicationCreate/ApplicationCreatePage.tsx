import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ApplicationCreateForm } from "#/applications";

export function ApplicationCreatePage() {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Add New Application</DialogTitle>
      </DialogHeader>
      <ApplicationCreateForm />
    </>
  );
}
