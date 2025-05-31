import Lottie, { LottieRefCurrentProps } from "lottie-react";
import loading_anim from "../../../public/loading_anim.json";
import { useEffect, useRef } from "react";

const Loading = () => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(2.5);
    }
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Lottie
        animationData={loading_anim}
        loop={true}
        className="w-80 h-80"
        lottieRef={lottieRef}
      />
    </div>
  );
};

export default Loading;
