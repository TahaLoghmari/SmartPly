import { Bot } from "lucide-react";

export function SidebarAI() {
  return (
    <div className="border-b border-gray-200 p-4 transition-all duration-300">
      <div className="bg-background hover:text-accent-foreground flex h-10 w-full cursor-pointer items-center justify-start gap-3 rounded-md border border-[#6c79e1]/20 px-4 py-2 text-sm font-medium text-[#6c79e1] transition-colors hover:bg-[#6c79e1]/10">
        <Bot className="h-4 w-4" />
        <p>AI Assistant</p>
      </div>
    </div>
  );
}
