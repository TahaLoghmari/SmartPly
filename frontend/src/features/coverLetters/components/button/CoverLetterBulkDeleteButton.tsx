import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function CoverLetterBulkDeleteButton({
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
    <Button variant="destructive" onClick={onClick} className="cursor-pointer">
      {!isLoading ? (
        "Delete Selected"
      ) : (
        <Spinner className="h-5 w-5 border-2 invert" />
      )}
    </Button>
  );
}
