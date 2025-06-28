import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PageFallBack() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3">
      <p className="text-3xl font-bold">Whoops, something went wrong.</p>
      <p>Please either refresh the page or return home to try again.</p>
      <Button className="cursor-pointer bg-gradient-to-r from-[#6c79e1] to-[#7057b0] p-6 hover:bg-[#9e85f4]">
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}
