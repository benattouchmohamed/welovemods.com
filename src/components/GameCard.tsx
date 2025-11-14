import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import RatingStars from './RatingStars';
import type { Game } from '@/services/gameService';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const createSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  return (
    <Link to={`/game/${createSlug(game.title)}`} className="block">
      <div className="bg-cartoon-cream border-4 border-cartoon-orange rounded-2xl p-3 shadow-base hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Game Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
          <img
            src={game.image_url || '/placeholder.svg'}
            alt={game.title}
            className="w-full h-full object-cover"
            loading="lazy" // <-- lazy-load
            width={300}    // <-- set width
            height={300}   // <-- set height
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {game.is_new && (
              <span className="bg-cartoon-green text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                NEW
              </span>
            )}
            {game.is_mod && (
              <span className="bg-cartoon-blue text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                MOD
              </span>
            )}
            {game.is_hot && (
              <span className="bg-cartoon-red text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                HOT
              </span>
            )}
          </div>
        </div>

        {/* Game Info */}
        <div className="space-y-2">
          <h3 className="font-black text-sm text-gray-800 leading-tight truncate">
            {game.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center">
            <RatingStars rating={game.rating} />
          </div>

          {/* Download Button */}
          <button className="w-full bg-cartoon-green text-white font-black text-sm py-2 px-4 rounded-full flex items-center justify-center gap-2 hover:bg-cartoon-green/90 transition-colors shadow-green">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </Link>
  );
};

// Memoize to prevent re-rendering unless props change
export default memo(GameCard);
