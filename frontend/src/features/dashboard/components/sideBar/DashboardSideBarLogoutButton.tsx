import { LogOut } from "lucide-react";
import { useLogout, useAuthStore } from "#/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDashboardSideBarStore } from "#/dashboard";

export function DashboardSideBarLogoutButton() {
  const { activeState } = useDashboardSideBarStore();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={`bg-background flex h-10 w-full cursor-pointer items-center rounded-md px-3 py-0 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 ${!activeState || logoutMutation.isPending ? "justify-center" : "justify-start gap-3"}`}
        >
          {logoutMutation.isPending ? (
            <Spinner className="h-8 w-auto" />
          ) : (
            <>
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {activeState && <p className="whitespace-nowrap">Logout</p>}
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            Log out of SmartPly as {user?.email}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => logoutMutation.mutate()}>
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
