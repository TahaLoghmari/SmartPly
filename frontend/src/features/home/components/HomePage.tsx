import { Header } from "../../home";

export function HomePage() {
  return (
    <div className="flex w-screen flex-col items-center">
      <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
        <Header />
      </div>
    </div>
  );
}
