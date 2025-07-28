import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function handleApiError(apiError: any) {
  toast.custom(() => (
    <div className="bg-card flex gap-3 rounded-md border p-4">
      <AlertCircle className="h-5 w-5" />
      <div className="flex flex-1 flex-col gap-2">
        <p className="font-bold">{apiError.title}</p>
        <p className="text-muted-foreground text-xs">{apiError.detail}</p>
        <ul className="border-muted-foreground mt-1 border-l-2 pl-3 text-sm">
          {Object.values(apiError.errors)
            .flat()
            .map((error, i) => (
              <li key={i} className="mb-1">
                {typeof error === "string" ? error : String(error)}
              </li>
            ))}
        </ul>
      </div>
    </div>
  ));
}
