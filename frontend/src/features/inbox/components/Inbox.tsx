import { useGetUserEmails } from "#/inbox";

export function Inbox() {
  const { data: emails, isLoading } = useGetUserEmails();
  if (isLoading) return;
  console.log(emails);
  return <div></div>;
}
