import { usePatchApplication, type JsonPatchOp } from "#/applications";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { handleApiError } from "@/hooks/useHandleApiError";
import { useState } from "react";

export function ApplicationPageStatusDate({
  applicationStatusDate,
  step,
  id,
}: {
  applicationStatusDate: Date | undefined;
  step: string;
  id: string;
}) {
  const [date, setDate] = useState<Date | undefined>(
    applicationStatusDate instanceof Date
      ? new Date(
          applicationStatusDate.getFullYear(),
          applicationStatusDate.getMonth(),
          applicationStatusDate.getDate(),
        )
      : undefined,
  );
  const patchApplicationMutation = usePatchApplication();
  return (
    <>
      <p className="flex items-center font-medium">
        {step}
        <span className="text-muted-foreground ml-2 flex items-center text-xs font-normal">
          {date
            ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() % 100}`
            : ""}
        </span>
      </p>
      <Popover>
        <PopoverTrigger>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
            className="text-muted-foreground h-3 w-3 cursor-pointer"
          >
            <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
          </svg>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            required
            defaultMonth={date ? date : new Date()}
            selected={date ? date : new Date()}
            onSelect={(selectedDate) => {
              if (!selectedDate) return;
              const patchRequest: JsonPatchOp[] = [
                {
                  op: "replace",
                  path: `/${step[0].toLowerCase() + step.slice(1)}Date`,
                  value: selectedDate.toISOString(),
                },
              ];
              patchApplicationMutation.mutate(
                { id, patch: patchRequest },
                {
                  onSuccess: () => setDate(selectedDate),
                  onError: (error) => handleApiError(error),
                },
              );
            }}
            className="rounded-lg border shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
