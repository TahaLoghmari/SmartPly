import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "#/auth";
import { Spinner } from "@/components/ui/spinner";

interface UserGuardProps {
  children: React.ReactNode;
}

export default function UserGuard({ children }: UserGuardProps) {
  const { data: user, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="dark:invert" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
