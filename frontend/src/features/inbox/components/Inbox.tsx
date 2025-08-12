import { useCurrentUser } from "#/auth";
import { EmailCard, useGetUserEmails, type Email } from "#/inbox";
import { Spinner } from "@/components/ui/spinner";
import { useInView } from "react-intersection-observer";

export function Inbox() {
  const { data: user } = useCurrentUser();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useGetUserEmails();

  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const emails = data?.pages.flatMap((page) => page.items) ?? [];

  if (user?.isInitialSyncComplete === false || isPending)
    return (
      <div className="flex h-[80svh] flex-1 flex-col items-center justify-center gap-2">
        {user?.isInitialSyncComplete === false && (
          <p className="text-muted-foreground mb-2 animate-pulse text-center text-sm">
            Setting up your inbox. Initial sync in progress...
          </p>
        )}
        <Spinner />
      </div>
    );

  return (
    <>
      {emails.map((email: Email) => (
        <EmailCard email={email} key={email.id} />
      ))}

      {isFetchingNextPage && (
        <div className="mt-6 flex w-full flex-1 flex-col items-center justify-center">
          <Spinner />
        </div>
      )}
      {hasNextPage && <div ref={ref} className="" />}
    </>
  );
}
