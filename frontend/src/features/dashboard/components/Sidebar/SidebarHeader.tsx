import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSideBarState } from "../../../dashboard";
import { useAuthStore } from "../../../auth";

export function SideBarHeader() {
  const { activeState } = useSideBarState();
  const { user } = useAuthStore();
  return (
    <div
      className={`flex items-center border-b border-gray-200 p-2 py-4 transition-all duration-300 ${!activeState ? "justify-center" : "justify-start gap-3"}`}
    >
      <Avatar className="h-10 w-auto">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {activeState && (
        <div className="flex flex-col items-start justify-center">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      )}
    </div>
  );
}
