import { SideBar, MainContent } from "../../dashboard";

export function Dashboard() {
  return (
    // Red div
    <div className="flex w-full">
      {/* left green div */}
      <SideBar />
      {/* right green div */}
      <MainContent />
    </div>
  );
}
