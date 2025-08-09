import { useParams } from "react-router-dom";
import { useRef } from "react";
import {
  formatEmailDate,
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

  // const headers = email.payload?.headers;
  // const fromRaw = getHeader(headers, "From");
  // const from = getSenderName(fromRaw);
  // const subject = getHeader(headers, "Subject");
  // const dateRaw = getHeader(headers, "Date");
  // const date = formatEmailDate(dateRaw);
  const bodyHtml = getEmailBody(email.payload);

  return (
    <iframe className="max-w-full flex-1 overflow-y-auto" srcDoc={bodyHtml} />
  );
}
