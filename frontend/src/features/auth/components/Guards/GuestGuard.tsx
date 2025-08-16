import { Navigate } from "react-router-dom";
import { useCurrentUser, type GuardProps } from "#/auth";
import { Spinner } from "@/components/ui/spinner";

export default function GuestGuard({ children }: GuardProps) {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isError) return <>{children}</>;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (user) return <Navigate to="/app" replace />;

  return <>{children}</>;
}
