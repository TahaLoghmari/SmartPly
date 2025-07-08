import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApplicationCreatePage } from "#/applications";

export function ApplicationCreateWrapper() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/app/applications");
  };

  return (
    <Dialog open onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-h-[90vh] overflow-auto sm:max-w-4xl"
        aria-describedby={undefined}
      >
        <ApplicationCreatePage />
      </DialogContent>
    </Dialog>
  );
}
