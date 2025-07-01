import loadingAnimation from "../../assets/Animation - 1744089714161.json";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";

export function Spinner({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Lottie
      {...props}
      animationData={loadingAnimation}
      loop
      autoplay
      className={cn("dark:invert", className)}
    />
  );
}
