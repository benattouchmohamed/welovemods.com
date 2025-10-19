import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, maxRating = 5 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < maxRating; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star className="w-3 h-3 stroke-gray-300" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star key={i} className="w-3 h-3 stroke-gray-300" />
      );
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
};

export default RatingStars;