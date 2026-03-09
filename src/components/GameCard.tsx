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
      whileHover={{ y: -3 }}
      className="group"
    >
      <Link to={`/game/${createSlug(game.title)}`} className="block h-full">
        <div className="bg-white border border-[hsl(var(--border))] rounded-xl p-2 md:p-3 shadow-[var(--shadow-blue)] hover:shadow-[var(--shadow-lg)] transition-all duration-200 h-full flex flex-col">

          {/* Image Container */}
          <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
            <img
              src={game.image_url || '/placeholder.svg'}
              alt={game.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Badges */}
            <div className="absolute top-1 left-1 flex flex-col gap-1">
              {game.is_new && (
                <span className="bg-[hsl(var(--cartoon-pink))] text-white text-[8px] md:text-[10px] font-semibold px-1.5 py-0.5 rounded-md w-fit">
                  New
                </span>
              )}
              {game.is_mod && (
                <span className="bg-[hsl(var(--cartoon-green))] text-white text-[8px] md:text-[10px] font-semibold px-1.5 py-0.5 rounded-md w-fit">
                  Mod
                </span>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-bold text-[11px] md:text-[15px] text-[hsl(var(--foreground))] leading-tight line-clamp-2 mb-2">
              {game.title}
            </h3>

            <div className="flex items-center justify-between mb-3">
              <div className="scale-[0.7] md:scale-90 origin-left">
                <RatingStars rating={game.rating} />
              </div>
              <span className="text-[9px] md:text-[11px] font-medium text-[hsl(var(--muted-foreground))]">v{game.version}</span>
            </div>

            {/* Download Button — glassy green with shimmer */}
            <div className="mt-auto">
              <div
                className="relative w-full overflow-hidden rounded-xl flex items-center justify-center gap-1.5 py-2 transition-all duration-300 group-hover:scale-[1.03]"
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
                  boxShadow: '0 0 0 1px rgba(34,197,94,0.4), 0 4px 14px rgba(22,163,74,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
                }}
              >
                {/* Shimmer stripe on hover */}
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                  }}
                />

                {/* Icon bubble */}
                <span
                  className="flex items-center justify-center rounded-lg w-5 h-5 shrink-0"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Download size={11} strokeWidth={2.5} className="text-white" />
                </span>

                <span className="text-white text-[10px] md:text-[11px] font-bold tracking-wide">
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