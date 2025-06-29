import { Bot } from "lucide-react";
import { useDashboardSideBarState } from "#/dashboard";

export function DashboardSideBarAI() {
  const { activeState } = useDashboardSideBarState();
  return (
    <div className="border-b border-gray-200 p-4 transition-all duration-300">
      <div
        className={`text-secondary-foreground hover:bg-secondary/80 flex h-10 w-full cursor-pointer items-center rounded-md border px-3 text-sm font-medium transition-all duration-200 ${
          activeState ? "justify-start gap-3" : "justify-center"
        }`}
      >
        <Bot className="h-4 w-4 flex-shrink-0" />
        {activeState && <p className="whitespace-nowrap">AI Assistant</p>}
      </div>
    </div>
  );
}
