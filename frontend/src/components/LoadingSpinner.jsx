import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative w-20 h-20">
        {/* Outer Circle */}
        <div className="absolute inset-0 border-4 border-white border-opacity-20 rounded-full"></div>
        {/* Inner Spinning Circle */}
        <div
          className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"
          style={{ animationDuration: "1.2s" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
