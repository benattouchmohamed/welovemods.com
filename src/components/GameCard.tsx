import React from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';
import type { Game } from '@/services/gameService';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  return (
    <motion.div
      whileHover={{ y: -4, x: -4 }}
      className="group"
    >
      <Link to={`/game/${createSlug(game.title)}`} className="block h-full">
        {/* Main Card Container: Neobrutalist Style */}
        <div className="bg-white border-2 border-black rounded-xl p-2 md:p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 h-full flex flex-col">
          
          {/* Image Container */}
          <div className="relative aspect-square rounded-lg overflow-hidden mb-3 border-2 border-black">
            <img
              src={game.image_url || '/placeholder.svg'}
              alt={game.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Badges: High Contrast / Flat Colors */}
            <div className="absolute top-1 left-1 flex flex-col gap-1">
              {game.is_new && (
                <span className="bg-[#FF70C1] text-black border border-black text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded uppercase w-fit">
                  NEW
                </span>
              )}
              {game.is_mod && (
                <span className="bg-[#4FB39A] text-black border border-black text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded uppercase w-fit">
                  MOD
                </span>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-black text-[11px] md:text-[16px] text-black leading-tight line-clamp-2 uppercase tracking-tighter mb-2">
              {game.title}
            </h3>

            <div className="flex items-center justify-between mb-3">
              <div className="scale-[0.7] md:scale-90 origin-left">
                <RatingStars rating={game.rating} />
              </div>
              <span className="text-[9px] md:text-[11px] font-black text-gray-500 uppercase">v{game.version}</span>
            </div>

            {/* The "Youform Orange" Download Button */}
            <div className="mt-auto">
              <div className="w-full bg-[#FF814D] border-2 border-black text-black font-black rounded-lg flex items-center justify-center gap-1 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-active:shadow-none group-active:translate-y-[2px] transition-all">
                <Download size={14} strokeWidth={3} />
                <span className="text-[10px] md:text-xs uppercase tracking-tight">
                  Get Mod
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default GameCard;