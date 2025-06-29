import { Sidebar, MainContent } from "../../dashboard";

export function Dashboard() {
  return (
    // Red div
    <div className="flex w-full">
      {/* left green div */}
      <Sidebar />
      {/* right green div */}
      <MainContent />
    </div>
  );
}
