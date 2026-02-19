import React from 'react';

interface GameCardSkeletonProps {
  isHorizontal?: boolean;
  count?: number;
}

const GameCardSkeleton = ({ isHorizontal = false, count = 10 }: GameCardSkeletonProps) => {
  const skeletonCards = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`
        ${isHorizontal ? 'min-w-[160px] md:min-w-[220px]' : 'w-full'}
        bg-white border-2 border-black rounded-xl p-2 md:p-3 
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse
      `}
    >
      <div className="flex flex-col h-full">
        {/* Image/Poster placeholder */}
        <div className="aspect-square bg-gray-200 border-2 border-black rounded-lg mb-3"></div>

        {/* Title placeholder */}
        <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-3"></div>

        {/* Info Row placeholders */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-3 bg-gray-100 rounded w-1/3"></div>
          <div className="h-3 bg-gray-100 rounded w-1/4"></div>
        </div>

        {/* Button placeholder */}
        <div className="mt-auto h-10 bg-gray-200 border-2 border-black rounded-lg w-full"></div>
      </div>
    </div>
  ));

  if (isHorizontal) {
    return (
      <div className="flex space-x-4 md:space-x-6 overflow-x-auto pb-4 no-scrollbar">
        {skeletonCards}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {skeletonCards}
    </div>
  );
};

export default GameCardSkeleton;