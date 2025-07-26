import { type TechnologiesUsedProps, frameworks } from "#/applications";
import { Badge } from "@/components/ui/badge";

export function TechnologiesUsed({
  technologies,
  className,
}: TechnologiesUsedProps) {
  const MAX_DISPLAY = 5;
  return (
    <div className={`flex flex-wrap items-center gap-1 ${className ?? ""}`}>
      {technologies.slice(0, MAX_DISPLAY).map((techValue) => (
        <Badge variant="secondary" key={techValue}>
          {frameworks.find((f) => f.value === techValue)?.label || techValue}
        </Badge>
      ))}

      {technologies.length > MAX_DISPLAY && (
        <Badge variant="outline">
          +{technologies.length - MAX_DISPLAY} more
        </Badge>
      )}
    </div>
  );
}
