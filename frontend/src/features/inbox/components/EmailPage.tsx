import { useParams } from "react-router-dom";
import {
  extractEmail,
  formatEmailDisplay,
  getEmailBody,
  getHeader,
  getSenderName,
  useGetUserEmail,
} from "#/inbox";
import { Spinner } from "@/components/ui/spinner";

export function EmailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: email, isLoading, isError } = useGetUserEmail({ id: id! });

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !email) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
        <p className="text-primary text-4xl font-medium">An Error Occured</p>
        <p className="text-sm">Please refresh the page</p>
      </div>
    );
  }

  const headers = email.payload?.headers;
  const from = getHeader(headers, "From");
  const senderEmail = extractEmail(from || "");
  const senderName = getSenderName(from || "");
  const subject = getHeader(headers, "Subject");
  const dateRaw = getHeader(headers, "Date");

  const formattedDate = formatEmailDisplay(dateRaw || "");

  const bodyHtml = getEmailBody(email.payload);

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto pt-4">
      <p className="mb-2 ml-15 text-2xl font-bold">{subject}</p>
      <div className="mx-15 flex items-center justify-between border-b pb-4">
        <p>
          {senderName}{" "}
          <span className="text-muted-foreground text-xs">
            {" "}
            &lt;{senderEmail}&gt;
          </span>
        </p>
        <p className="text-muted-foreground text-xs">{formattedDate}</p>
      </div>
      <iframe className="mx-15 max-w-full flex-1" srcDoc={bodyHtml} />
    </div>
  );
}
