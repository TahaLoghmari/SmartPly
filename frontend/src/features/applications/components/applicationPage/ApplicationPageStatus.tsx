import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applicationsStatusOptionsConstant, steps } from "#/applications";

export function ApplicationPageStatus() {
  return (
    <div className="bg-card flex w-full flex-col gap-6 rounded-lg border p-4 shadow-xs">
      <p className="font-medium">Application Status</p>
      <Select>
        <SelectTrigger className="w-full">
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
      <div className="flex flex-col">
        {steps.map((step, index) => (
          <div key={index} className="-mt-1 flex flex-col">
            <div className="flex items-center gap-2">
              <div
                className={`${step.status === "complete" ? "outline-accent outline-2" : ""} border-muted-foreground bg-background flex size-4 items-center justify-center rounded-full border`}
              >
                <div
                  className={`${step.status === "complete" ? "bg-muted-foreground size-1.5 rounded-full" : ""} `}
                ></div>
              </div>
              <p className="flex items-center font-medium">
                {step.label}{" "}
                <span className="text-muted-foreground ml-2 flex items-center text-xs font-normal">
                  {step.date}
                </span>
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
                className="text-muted-foreground h-3 w-3 cursor-pointer"
              >
                <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
              </svg>
            </div>
            {step.label != "Offer" && (
              <div className="bg-muted-foreground -mt-1 ml-[7.5px] h-7 w-px"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
