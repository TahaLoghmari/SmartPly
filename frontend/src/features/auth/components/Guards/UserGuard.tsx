import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser, type GuardProps } from "#/auth";
import { Spinner } from "@/components/ui/spinner";

export default function UserGuard({ children }: GuardProps) {
  const { data: user, isLoading, isError } = useCurrentUser();
  const location = useLocation();

  if (isError) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
