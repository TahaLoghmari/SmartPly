import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "#/auth";
import { useDashboardSideBarStore } from "#/dashboard";

export function SideBarHeader() {
  const { activeState } = useDashboardSideBarStore();
  const { data: user } = useCurrentUser();
  return (
    <div
      className={`flex items-center p-2 py-4 transition-[width,height,margin,padding] duration-300 ${!activeState ? "justify-center" : "justify-start gap-3"}`}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={user?.imageUrl} />
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
