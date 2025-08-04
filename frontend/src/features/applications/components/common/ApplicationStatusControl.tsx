import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  APPLICATIONS_STATUS_OPTIONS,
  type ApplicationsStatusControlProps,
} from "#/applications";
import { useUpdateApplicationStatus } from "#/applications";

export default function ApplicationStatusControl({
  applicationCard,
  className = "",
}: ApplicationsStatusControlProps) {
  const { updateApplicationStatus } =
    useUpdateApplicationStatus(applicationCard);

  return (
    <Select
      value={applicationCard.status}
      onValueChange={updateApplicationStatus}
    >
      <SelectTrigger className={`cursor-pointer ${className}`}>
        <SelectValue
          placeholder="Status"
          className="text-primary placeholder:text-primary text-sm"
        />
      </SelectTrigger>
      <SelectContent>
        {APPLICATIONS_STATUS_OPTIONS.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
