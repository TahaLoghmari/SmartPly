import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SidebarHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-gray-200 p-4 transition-all duration-300">
      <Avatar className="h-10 w-auto">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start justify-center">
        <p className="text-sm font-semibold">Username</p>
        <p className="text-xs text-gray-500">Email@gmail.com</p>
      </div>
    </div>
  );
}
