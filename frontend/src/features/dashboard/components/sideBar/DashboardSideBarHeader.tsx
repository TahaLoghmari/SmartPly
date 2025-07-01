import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "#/auth";
import { useDashboardSideBarStore } from "#/dashboard";

export function DashboardSideBarHeader() {
  const { activeState } = useDashboardSideBarStore();
  const { user } = useAuthStore();
  return (
    <div
      className={`flex items-center border-b p-2 py-4 transition-all duration-300 ${!activeState ? "justify-center" : "justify-start gap-3"}`}
    >
      <Avatar className="h-10 w-auto">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </AvatarFallback>
      </Avatar>
      {activeState && (
        <div className="flex flex-col items-start justify-center">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-muted-foreground text-xs">{user?.email}</p>
        </div>
      )}
    </div>
  );
}
