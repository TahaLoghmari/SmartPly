import { useLogout } from "../../auth/hooks/useLogout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

export default function Test() {
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  return (
    <div>
      <Button
        onClick={() => {
          logoutMutation.mutate(undefined, {
            onSuccess: () => {
              navigate("/");
              setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            },
          });
        }}
      >
        Logout
      </Button>
    </div>
  );
}
