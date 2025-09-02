import { useCurrentUser } from "#/auth";
import { EmailCard, useGetUserEmails, type EmailResponseDto } from "#/inbox";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useInView } from "react-intersection-observer";

export function Inbox({ jobRelated }: { jobRelated?: boolean }) {
  const { data: user } = useCurrentUser();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useGetUserEmails();

  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const emails = !jobRelated
    ? (data?.pages.flatMap((page) => page.items) ?? [])
    : (data?.pages
        .flatMap((page) => page.items)
        .filter((e) => e.isJobRelated === true) ?? []);

  if (!user?.gmailConnected) {
    return (
      <div className="flex h-[80svh] flex-1 flex-col items-center justify-center gap-4">
        <p className="text-foreground text-center text-lg font-semibold">
          Gmail is not connected!
        </p>
        <span className="text-muted-foreground text-center leading-relaxed">
          Connect your Gmail account to view your inbox.
        </span>
      </div>
    );
  }

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

  if (emails.length === 0) {
    return (
      <div className="flex h-[80svh] flex-1 flex-col items-center justify-center gap-4">
        <span className="text-muted-foreground text-lg">
          {jobRelated ? "Your job inbox is empty." : "Your inbox is empty."}
        </span>
      </div>
    );
  }

  return (
    <>
      {emails.map((email: EmailResponseDto) => (
        <EmailCard email={email} key={email.id} />
      ))}

      {isFetchingNextPage && (
        <div className="mt-6 flex w-full flex-1 flex-col items-center justify-center">
          <Spinner />
        </div>
      )}
      {emails.length > 0 && isError && (
        <div className="mt-6 flex w-full flex-1 flex-col items-center justify-center gap-2">
          <span className="text-muted-foreground text-sm">
            Failed to load more emails.
          </span>
          <Button className="cursor-pointer" onClick={() => fetchNextPage}>
            {isFetchingNextPage ? (
              <Spinner className="h-6 w-6 border-2 invert" />
            ) : (
              "Retry"
            )}
          </Button>
        </div>
      )}
      {hasNextPage && !isError && <div ref={ref} />}
    </>
  );
}
