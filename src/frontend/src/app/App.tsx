import { Outlet } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useAuthOnMount } from "../features/auth";

export default function App() {
  const { isLoading } = useAuthOnMount();

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  else return <Outlet />;
}
