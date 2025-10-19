// 
// components/GameCardSkeleton.tsx
import React from 'react';

// Define types for props
interface GameCardSkeletonProps {
  isHorizontal?: boolean;
  count?: number;
}

// Theme colors configuration (same as in Navbar)
const themeColors = {
  primary: 'pink-600',
  primaryDark: 'pink-400',
  hover: 'pink-500',
  hoverDark: 'pink-300',
  border: 'pink-300',
  borderDark: 'pink-500',
};

const GameCardSkeleton = ({ isHorizontal = false, count = 10 }: GameCardSkeletonProps) => {
  const skeletonCards = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`
        ${isHorizontal ? 'min-w-[200px]' : 'w-full'}
        animate-stagger-fade-in gradient-border rounded-xl shadow-md p-4 overflow-hidden
      `}
    >
      <div className="animate-pulse">
        {/* Poster placeholder */}
        <div className="aspect-[3/2] shimmer rounded-lg mb-4"></div>

        {/* Title placeholder */}
        <div className="h-4 shimmer rounded w-3/4 mb-3"></div>

        {/* Info row placeholder */}
        <div className="space-y-3">
          <div className="h-3 shimmer rounded w-1/2"></div>
          <div className="h-8 shimmer rounded w-full"></div>
        </div>
      </div>
    </div>
  ));

  if (isHorizontal) {
    return (
      <div className="flex space-x-5 overflow-x-auto no-scrollbar">
        {skeletonCards}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {skeletonCards}
    </div>
  );
};

// Inline styles for skeleton (aligned with Navbar's themeColors)
const styles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes staggerFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-stagger-fade-in {
    animation: staggerFadeIn 0.5s ease-out forwards;
  }
  .animate-stagger-fade-in:nth-child(2n) { animation-delay: 0.1s; }
  .animate-stagger-fade-in:nth-child(3n) { animation-delay: 0.2s; }
  .animate-stagger-fade-in:nth-child(4n) { animation-delay: 0.3s; }
  .gradient-border {
    border: 2px solid transparent;
    background: linear-gradient(white, white) padding-box,
                linear-gradient(90deg, ${themeColors.primary}, ${themeColors.primaryDark}) border-box;
    border-radius: 12px;
  }
  .dark .gradient-border {
    background: linear-gradient(hsl(var(--background)), hsl(var(--background))) padding-box,
                linear-gradient(90deg, ${themeColors.primary}, ${themeColors.primaryDark}) border-box;
  }
  .shimmer {
    background: linear-gradient(
      90deg,
      hsl(var(--muted)) 25%,
      ${themeColors.primary} 50%,
      hsl(var(--muted)) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
    box-shadow: inset 0 0 15px ${themeColors.primary}/0.3;
  }
  .dark .shimmer {
    background: linear-gradient(
      90deg,
      hsl(var(--muted)) 25%,
      ${themeColors.primaryDark} 50%,
      hsl(var(--muted)) 75%
    );
    box-shadow: inset 0 0 15px ${themeColors.primaryDark}/0.3;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default GameCardSkeleton;