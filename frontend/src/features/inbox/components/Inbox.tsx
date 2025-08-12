import { EmailCard, useGetUserEmails, type Email } from "#/inbox";
import { Spinner } from "@/components/ui/spinner";
import { useInView } from "react-intersection-observer";

export function Inbox() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
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

  if (isLoading)
    return (
      <div className="flex h-[80svh] flex-1 flex-col items-center justify-center gap-2">
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
