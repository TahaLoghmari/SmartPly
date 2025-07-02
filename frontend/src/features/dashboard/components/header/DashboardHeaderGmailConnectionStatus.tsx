import { useAuthStore } from "#/auth";
import { Mail, CircleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DashboardHeaderConnectGmailButton } from "#/dashboard";

export function DashboardHeaderGmailConnectionStatus() {
  const { user } = useAuthStore();
  return (
    <AlertDialog>
      <AlertDialogTrigger
        disabled={user?.gmailConnected}
        className={`${user?.gmailConnected ? "border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100 hover:text-green-900" : "cursor-pointer border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 hover:text-red-900"} flex h-10 items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-sm`}
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
      </AlertDialogTrigger>
      <AlertDialogContent className="w-112 p-0">
        <DashboardHeaderConnectGmailButton />
      </AlertDialogContent>
    </AlertDialog>
  );
}
