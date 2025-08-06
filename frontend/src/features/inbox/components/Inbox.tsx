import { useGetUserEmails } from "#/inbox";
import { Button } from "@/components/ui/button";

export function Inbox() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetUserEmails();

  if (isLoading) return <div>Loading...</div>;

  const emails = data?.pages.flatMap((page) => page.messages) ?? [];

  console.log("data: ", data?.pages);
  console.log("email: ", emails);

  return (
    <div>
      {/* <ul>
        {emails.map((email) => (
          <li key={email.id}>{email.snippet}</li>
        ))}
      </ul> */}
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : "Load more"}
        </Button>
      )}
    </div>
  );
}
