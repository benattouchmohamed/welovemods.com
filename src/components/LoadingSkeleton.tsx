import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const LoadingSkeleton: React.FC = () => {
  const isMobile = useIsMobile();
  const skeletonCount = isMobile ? 4 : 12;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(skeletonCount)].map((_, index) => (
        <div
          key={index}
          className="card rounded-xl p-4 overflow-hidden animate-pulse"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="aspect-[3/2] bg-muted rounded-lg mb-4 bg-gradient-to-r from-muted via-accent/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-3/4 bg-gradient-to-r from-muted via-accent/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            <div className="h-3 bg-muted rounded w-1/2 bg-gradient-to-r from-muted via-accent/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            <div className="h-8 bg-muted rounded w-full bg-gradient-to-r from-muted via-accent/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
