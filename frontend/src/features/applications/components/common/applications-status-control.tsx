import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  applicationsStatusOptionsConstant,
  usePatchApplication,
  ApplicationStatusControlBuildPatch,
  type ApplicationsStatusControlProps,
} from "#/applications";

export function ApplicationsStatusControl({
  applicationCard,
  className = "",
}: ApplicationsStatusControlProps) {
  const patchApplicationMutation = usePatchApplication();

  const handleValueChange = (newStatus: string) => {
    const patchRequest = ApplicationStatusControlBuildPatch(
      applicationCard,
      newStatus,
    );
    patchApplicationMutation.mutate({
      id: applicationCard.id,
      patch: patchRequest,
    });
  };

  return (
    <Select value={applicationCard.status} onValueChange={handleValueChange}>
      <SelectTrigger className={`cursor-pointer ${className}`}>
        <SelectValue
          placeholder="Status"
          className="text-primary placeholder:text-primary text-sm"
        />
      </SelectTrigger>
      <SelectContent>
        {applicationsStatusOptionsConstant.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
