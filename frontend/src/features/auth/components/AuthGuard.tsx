import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../auth";
import { Spinner } from "@/components/ui/spinner";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
