import { Navigate } from "react-router-dom";
import { useCurrentUser, type GuardProps } from "#/auth";
import { Spinner } from "@/components/ui/spinner";

export default function GuestGuard({ children }: GuardProps) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="dark:invert" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
