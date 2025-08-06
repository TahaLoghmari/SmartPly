import { MailCard, useGetUserEmails, type Email } from "#/inbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function Inbox() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetUserEmails();

  const emails = data?.pages.flatMap((page) => page.messages) ?? [];

  console.log("data: ", data?.pages);
  console.log("email: ", emails);

  if (isLoading)
    return (
      <div className="flex flex-col items-center gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[99px] w-[95%]" />
        ))}
      </div>
    );

  return (
    <>
      {emails.map((email: Email) => (
        <MailCard email={email} key={email.id} />
      ))}

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : "Load more"}
        </Button>
      )}
    </>
  );
}
