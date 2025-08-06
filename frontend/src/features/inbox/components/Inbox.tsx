import { MailCard, useGetUserEmails, type Email } from "#/inbox";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export function Inbox() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetUserEmails();

  const { ref, inView } = useInView({ rootMargin: "200px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const emails = data?.pages.flatMap((page) => page.messages) ?? [];

  if (isLoading)
    return (
      <div className="flex h-[80svh] flex-1 flex-col items-center justify-center gap-2">
        <Spinner className="dark:invert" />
      </div>
    );

  return (
    <>
      {emails.map((email: Email) => (
        <MailCard email={email} key={email.id} />
      ))}

      {isFetchingNextPage && (
        <div className="mt-6 flex w-full flex-1 flex-col items-center justify-center">
          <Spinner className="dark:invert" />
        </div>
      )}
      {hasNextPage && <div ref={ref} />}
    </>
  );
}
