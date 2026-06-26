import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router-dom";

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-background">
      {/* Zoomed Animation wrapper */}
      <div className="w-[350px] sm:w-[500px] md:w-[650px] max-w-full">
        <DotLottieReact
          src="/error.lottie"
          autoplay
          loop
        />
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-primary mt-6 mb-2">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-xs text-muted max-w-sm mb-6 leading-relaxed">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>

      {/* Action Button */}
      <Link
        to="/"
        className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded hover:opacity-90 transition-opacity"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;