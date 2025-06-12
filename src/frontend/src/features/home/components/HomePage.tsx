import Header from "./Header";
import { useAuth } from "../../auth/hooks/useAuth";

export default function HomePage() {
  const { isLoading, error } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>error...</div>;
  return (
    <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
      <Header />
    </div>
  );
}
