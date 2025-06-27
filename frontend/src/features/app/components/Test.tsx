import { useLogout } from "../../auth/hooks/useLogout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth";

export default function Test() {
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  return (
    <div>
      <Button
        onClick={() => {
          logoutMutation.mutate(undefined, {
            onSuccess: () => {
              navigate("/");
              logout();
            },
          });
        }}
      >
        Logout
      </Button>
    </div>
  );
}
