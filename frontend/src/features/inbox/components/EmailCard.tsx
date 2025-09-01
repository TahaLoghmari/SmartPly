import { decodeHtmlEntities, formatEmailDate, type Email } from "#/inbox";
import { NavLink } from "react-router-dom";

export function EmailCard({ email }: { email: Email }) {
  const date = formatEmailDate(email.headerDate!);
  return (
    <NavLink
      key={email.id}
      to={`/app/inbox/${email.id}`}
      className={({ isActive }) =>
        [
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex cursor-pointer flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap",
          isActive ? "border-l-primary border-l-4" : "",
        ].join(" ")
      }
    >
      <div className="flex w-full items-center gap-2">
        <span className="w-[208px] truncate">
          {decodeHtmlEntities(email?.fromName)}
        </span>
        <span className="ml-auto text-xs">{date}</span>
      </div>
      <span className="w-[260px] truncate font-medium">{email?.subject}</span>
      <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
        {decodeHtmlEntities(email.snippet)}
      </span>
    </NavLink>
  );
}
