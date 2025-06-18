import Header from "./Header";
import { useAuth } from "../../auth";
import { Spinner } from "@/components/ui/spinner";

export default function HomePage() {
  const { isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
      <Header />
    </div>
  );
}
