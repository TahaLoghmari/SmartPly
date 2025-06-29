import { Header, useSideBarState } from "../../dashboard";

export function MainContent() {
  const { activeState } = useSideBarState();
  return (
    // remove h-screen later , just used it for now
    <div
      className={` ${activeState ? "ml-65" : "ml-20"} h-screen w-full bg-[#f8fafa] transition-all duration-300`}
    >
      <Header />
    </div>
  );
}
