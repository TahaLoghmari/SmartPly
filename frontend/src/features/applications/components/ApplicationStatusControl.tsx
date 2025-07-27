import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  applicationsStatusOptionsConstant,
  statusToValue,
  steps,
  usePatchApplication,
  type ApplicationResponseDto,
  type JsonPatchOp,
} from "#/applications";

export function ApplicationStatusControl({
  applicationCard,
}: {
  applicationCard: ApplicationResponseDto;
}) {
  const patchApplicationMutation = usePatchApplication();

  const stepsWithLastStatus = [...steps, "Offer", "Rejected", "Ghosted"];
  return (
    <Select
      defaultValue={applicationCard.status}
      onValueChange={(newStatus) => {
        const newStatus_UpperCase =
          newStatus[0].toUpperCase() + newStatus.slice(1);
        const patchRequest: JsonPatchOp[] = [
          {
            op: "replace",
            path: "/status",
            value: newStatus,
          },
          ...stepsWithLastStatus
            .filter(
              (step) =>
                statusToValue[step] > statusToValue[newStatus_UpperCase],
            )
            .map((step) => ({
              op: "replace" as const,
              path: `/${step[0].toLowerCase() + step.slice(1)}Date`,
              value: null,
            })),
          ...stepsWithLastStatus
            .filter(
              (step) =>
                statusToValue[step] <= statusToValue[newStatus_UpperCase],
            )
            .map((step) => ({
              op: "replace" as const,
              path: `/${step[0].toLowerCase() + step.slice(1)}Date`,
              value: new Date().toISOString(),
            })),
        ];
        patchApplicationMutation.mutate({
          id: applicationCard.id,
          patch: patchRequest,
        });
      }}
    >
      <SelectTrigger className="w-[120px] cursor-pointer">
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
