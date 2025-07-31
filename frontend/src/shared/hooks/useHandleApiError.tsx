import { toast } from "sonner";

export function handleApiError(apiError: any) {
  toast.error(apiError.title, {
    description: (
      <div className="flex flex-1 flex-col gap-2">
        <p className="text-strong-muted-foreground text-xs">
          {apiError.detail}
        </p>
        {apiError.errors && (
          <ul className="border-muted-foreground text-muted-foreground mt-1 border-l-2 pl-3 text-sm">
            {Object.values(apiError.errors)
              .flat()
              .map((error, i) => (
                <li key={i} className="mb-1">
                  {typeof error === "string" ? error : String(error)}
                </li>
              ))}
          </ul>
        )}
      </div>
    ),
  });
}
