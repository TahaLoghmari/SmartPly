import loadingAnimation from "../../assets/Animation - 1744089714161.json";
import Lottie from "lottie-react";

export function Spinner() {
  return (
    <div className="loading-container">
      <Lottie animationData={loadingAnimation} loop autoplay />
    </div>
  );
}
