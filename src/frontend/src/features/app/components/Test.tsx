import { useAuth } from "../../auth/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Test() {
  const { logout } = useAuth();
  return (
    <div>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
