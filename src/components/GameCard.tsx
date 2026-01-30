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
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="group"
    >
      <Link to={`/game/${createSlug(game.title)}`} className="block">
        {/* Adjusted padding and border radius for 3-column mobile layout */}
        <div className="bg-white rounded-[1rem] md:rounded-[2rem] p-1.5 md:p-3 shadow-sm border border-slate-100 group-hover:border-sky-200 transition-all duration-300 h-full flex flex-col">
          
          {/* Visual Container - Aspect ratio keeps it square even on small screens */}
          <div className="relative aspect-square rounded-[0.8rem] md:rounded-[1.5rem] overflow-hidden mb-2 md:mb-4">
            <img
              src={game.image_url || '/placeholder.svg'}
              alt={game.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />

            {/* Badges - Simplified for Mobile */}
            <div className="absolute top-1 left-1 flex flex-col gap-0.5">
              {game.is_new && (
                <span className="bg-[#4ADE80] text-white text-[7px] md:text-[9px] font-black px-1 md:px-2 py-0.5 rounded shadow-sm uppercase w-fit">
                  NEW
                </span>
              )}
              {game.is_mod && (
                <span className="bg-[#3B82F6] text-white text-[7px] md:text-[9px] font-black px-1 md:px-2 py-0.5 rounded shadow-sm uppercase w-fit">
                  MOD
                </span>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="px-0.5 flex-1 flex flex-col justify-between">
            <div>
              {/* Title size optimized for 3-in-row */}
              <h3 className="font-black text-[10px] md:text-[15px] text-slate-800 leading-tight line-clamp-2 uppercase tracking-tighter md:tracking-tight mb-1">
                {game.title}
              </h3>

              {/* Version & Rating - Compacted */}
              <div className="flex items-center justify-between mb-2">
                <div className="scale-[0.65] md:scale-100 origin-left">
                  <RatingStars rating={game.rating} />
                </div>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400">v{game.version}</span>
              </div>
            </div>

            {/* Optimized Download Button */}
            <div className="relative">
              <div className="w-full bg-[#4ADE80] text-white font-black rounded-lg md:rounded-xl flex items-center justify-center gap-1 py-1.5 md:py-2.5 shadow-[0_3px_0_0_#16A34A] md:shadow-[0_4px_0_0_#16A34A] group-active:shadow-none group-active:translate-y-[2px] transition-all">
                <Download size={10} className="md:w-4 md:h-4" strokeWidth={4} />
                <span className="text-[8px] md:text-xs uppercase tracking-tighter">
                  Download
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
