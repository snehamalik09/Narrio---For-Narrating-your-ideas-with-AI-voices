import React from "react";

const PodcastSkeleton = () => {
  return (
    <div className="w-full max-w-[180px] sm:max-w-[180px] h-[165px] 2xl:w-[190px] 2xl:h-[190px] rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-gray-200 to-gray-300 relative">
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />

      {/* Thumbnail placeholder */}
      <div className="w-full h-[70%] bg-gray-300"></div>

      {/* Text placeholders */}
      <div className="px-3 py-2 space-y-2">
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default PodcastSkeleton;
