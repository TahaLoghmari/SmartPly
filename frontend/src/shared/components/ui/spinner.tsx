import loadingAnimation from "../../assets/Animation - 1744089714161.json";
import Lottie from "lottie-react";

export function Spinner(props: React.HTMLAttributes<HTMLDivElement>) {
  return <Lottie {...props} animationData={loadingAnimation} loop autoplay />;
}
