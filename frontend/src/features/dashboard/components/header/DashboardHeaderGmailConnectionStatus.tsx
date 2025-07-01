import { useAuthStore } from "#/auth";
import { Mail, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeaderGmailConnectionStatus() {
  const { user } = useAuthStore();
  return (
    <Button
      variant="outline"
      className={`${user?.gmailConnected ? "bg-[#dcfce7]" : "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100"} flex h-10 cursor-pointer items-center gap-3 px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-sm`}
    >
      {user?.gmailConnected ? (
        <Mail className="h-4 w-4" />
      ) : (
        <CircleAlert className="h-4 w-4" />
      )}

      <p>{user?.gmailConnected ? "Gmail Connected" : "Connect Gmail"}</p>
      {!user?.gmailConnected && (
        <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
      )}
    </Button>
  );
}
