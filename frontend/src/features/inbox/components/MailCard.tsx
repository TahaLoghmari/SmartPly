import {
  decodeHtmlEntities,
  formatEmailDate,
  getHeader,
  getSenderName,
  type Email,
} from "#/inbox";

export function MailCard({ email }: { email: Email }) {
  const headers = email.payload?.headers;
  const fromRaw = getHeader(headers, "From");
  console.log(fromRaw);
  const from = getSenderName(fromRaw);
  const subject = getHeader(headers, "Subject");
  const dateRaw = getHeader(headers, "Date");
  const date = formatEmailDate(dateRaw);
  return (
    <div
      key={email.id}
      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex cursor-pointer flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
    >
      <div className="flex w-full items-center gap-2">
        <span>{decodeHtmlEntities(from)}</span>
        <span className="ml-auto text-xs">{date}</span>
      </div>
      <span className="w-[260px] truncate overflow-hidden font-medium whitespace-nowrap">
        {subject}
      </span>
      <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
        {decodeHtmlEntities(email.snippet)}
      </span>
    </div>
  );
}
