import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, Flame, Sparkles, Heart, X, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

// --- Theme Aligned Config ---
const NAV_CONFIG = [
  { 
    to: '/', 
    icon: Home, 
    label: 'Home', 
    bg: 'bg-sky-500', 
    shadow: 'shadow-sky-700',
    glow: 'hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]'
  },
  { 
    to: '/categories', 
    icon: List, 
    label: 'Cats', 
    bg: 'bg-indigo-500', 
    shadow: 'shadow-indigo-700',
    glow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'
  },
  { 
    to: '/top-games', 
    icon: Flame, 
    label: 'Top', 
    bg: 'bg-orange-500', 
    shadow: 'shadow-orange-700',
    glow: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]'
  },
  { 
    to: '/new-games', 
    icon: Sparkles, 
    label: 'New', 
    bg: 'bg-emerald-500', 
    shadow: 'shadow-emerald-700',
    glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
  },
];

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const playSound = useCallback(() => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.1;
    audio.play().catch(() => {});
  }, []);

  return (
    <>
      {/* Header with higher Z-Index than Search Suggestions */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-3 md:px-8 md:py-4">
        <div className="mx-auto max-w-6xl">
          <div className="bg-white/80 backdrop-blur-md border-b-2 border-sky-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between px-4 py-2 md:px-8 md:py-3 transition-all">
            
            {/* Logo - Matching Index Sky Theme */}
            <Link to="/" onClick={playSound} className="flex items-center gap-2 group">
              <motion.div
                className="bg-orange-500 p-2 md:p-2.5 rounded-xl md:rounded-2xl shadow-lg shadow-sky-200"
                whileHover={{ scale: 1.05, rotate: -5 }}
              >
                <Heart className="w-5 h-5 text-white fill-white" />
              </motion.div>
              <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">
                welove<span className="text-orange-500">mods</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="flex items-center gap-3">
                {NAV_CONFIG.map((item) => (
                  <DesktopNavLink
                    key={item.to}
                    {...item}
                    active={pathname === item.to}
                    onClick={playSound}
                  />
                ))}
              </nav>
            )}

            {/* Mobile Menu Button - Styled like Index Search */}
            {isMobile && (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-sky-100 text-sky-600 active:scale-90 transition-all"
              >
                <Menu size={20} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-sky-900/20 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-[80%] max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-black text-slate-800">Explore</span>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 bg-slate-50 rounded-full text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              {NAV_CONFIG.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => { playSound(); setIsMenuOpen(false); }}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-white text-lg shadow-lg ${item.bg} ${item.shadow} active:scale-95 transition-all`}
                >
                  <div className="bg-white/20 p-2 rounded-lg">
                    <item.icon className="w-5 h-5" />
                  </div>
                  {item.label}
                </Link>
              ))}
              
              <div className="mt-auto p-4 bg-sky-50 rounded-3xl border border-sky-100 text-center">
                <p className="text-xs font-bold text-sky-600 uppercase tracking-widest">Version 2.0.26</p>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const DesktopNavLink = ({ to, icon: Icon, label, bg, shadow, glow, active, onClick }: any) => (
  <Link to={to} onClick={onClick} className="relative group">
    <motion.div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-white text-sm transition-all duration-200 
        ${bg} ${glow} ${active ? 'scale-105 ring-4 ring-sky-100' : `${shadow} hover:-translate-y-0.5`}
      `}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />
      <span>{label}</span>
    </motion.div>
  </Link>
);

export default Navbar;
