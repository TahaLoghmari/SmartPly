import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";

export default function ResumeBulkDeleteButton({
  show,
  onClick,
  isLoading,
}: {
  show: boolean;
  onClick: () => void;
  isLoading: boolean;
}) {
  if (!show) return null;
  return (
    <Button
      variant="outline"
      className="text-destructive/80 border-destructive/80 hover:text-destructive hover:bg-destructive/5 flex w-fit cursor-pointer items-center"
      onClick={onClick}
    >
      {!isLoading ? (
        <>
          <Trash2 className="h-4 w-4" />
          Delete Selected
        </>
      ) : (
        <Spinner className="h-5 w-5 border-2 invert" />
      )}
    </Button>
  );
}
