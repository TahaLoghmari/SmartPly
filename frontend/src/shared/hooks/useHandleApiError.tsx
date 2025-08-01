import type { ProblemDetailsDto } from "@/types";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface handleApiErrorProps {
  apiError: ProblemDetailsDto;
  email?: string;
}

export function handleApiError({ apiError, email }: handleApiErrorProps) {
  if (apiError instanceof TypeError) {
    toast.error("Unable to connect to the server.", {
      description: "Please check your internet connection and try again.",
    });
    return;
  }
  toast.error(apiError.title, {
    description: (
      <div className="flex flex-1 flex-col gap-2">
        <p className="text-strong-muted-foreground text-xs">
          {apiError.detail}
        </p>

        {/* this is for the toast error when email is not verified */}
        {email && apiError.title === "Email not Verified" && (
          <Link
            to={`/email-verification/?email=${email}`}
            className="text-muted-foreground hover:text-muted-foreground/20 underline"
          >
            Resend Email
          </Link>
        )}
        
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
