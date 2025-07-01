import { type ApplicationCardProps } from "#/applications";
import { Building } from "lucide-react";

export function ApplicationCard({ applicationCard }: ApplicationCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-xs transition-all hover:shadow-lg">
      <div className="flex justify-between">
        <div>
          <p className="tracking-light text-lg font-semibold">
            {applicationCard.position}
          </p>
          <p className="flex items-center gap-2">
            <Building className="text-muted-foreground h-4 w-4" />
            <p className="font-medium">{applicationCard.companyName}</p>
          </p>
        </div>
        <div>
          <p className="inline-flex items-center rounded-full border border-transparent bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 transition-all">
            {applicationCard.status}
          </p>
        </div>
      </div>
    </div>
  );
}
