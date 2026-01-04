import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';
import type { Game } from '@/services/gameService';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  // Helper to ensure URL friendly slugs
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
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Link to={`/game/${createSlug(game.title)}`} className="block">
        <div className="bg-white rounded-[2rem] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
          
          {/* Visual Container */}
          <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-4">
            <img
              src={game.image_url || '/placeholder.svg'}
              alt={game.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />

            {/* Premium Floating Badges */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {game.is_new && (
                <span className="bg-[#4ADE80] text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg uppercase tracking-tighter">
                  NEW
                </span>
              )}
              {game.is_mod && (
                <span className="bg-[#3B82F6] text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg uppercase tracking-tighter">
                  MOD
                </span>
              )}
              {game.is_hot && (
                <span className="bg-[#EF4444] text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg uppercase tracking-tighter">
                  HOT
                </span>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="px-1 pb-2 space-y-2">
            <h3 className="font-black text-base text-slate-800 leading-none truncate uppercase tracking-tight">
              {game.title}
            </h3>

            <div className="flex items-center justify-between">
              <RatingStars rating={game.rating} />
              <span className="text-[10px] font-black text-slate-400">v{game.version}</span>
            </div>

            {/* Premium "Squishy" Button */}
            <div className="relative pt-1">
              <div className="w-full bg-[#4ADE80] text-white font-black text-sm py-3 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_0_0_#16A34A] group-hover:shadow-[0_2px_0_0_#16A34A] group-hover:translate-y-[2px] transition-all">
                <Download size={16} strokeWidth={3} />
Download              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default GameCard;