import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, Flame, Sparkles, Heart, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

// --- Clean & Bright Config ---
const NAV_CONFIG = [
  { 
    to: '/', 
    icon: Home, 
    label: 'Home', 
    bg: 'bg-[#FF6B98]', 
    shadow: 'shadow-[#E54E7E]',
    glow: 'hover:shadow-[0_0_20px_rgba(255,107,152,0.4)]'
  },
  { 
    to: '/categories', 
    icon: List, 
    label: 'Cats', 
    bg: 'bg-[#A78BFA]', 
    shadow: 'shadow-[#7C3AED]',
    glow: 'hover:shadow-[0_0_20px_rgba(167,139,250,0.4)]'
  },
  { 
    to: '/top-games', 
    icon: Flame, 
    label: 'Top', 
    bg: 'bg-[#FFB347]', 
    shadow: 'shadow-[#E68A00]',
    glow: 'hover:shadow-[0_0_20px_rgba(255,179,71,0.4)]'
  },
  { 
    to: '/new-games', 
    icon: Sparkles, 
    label: 'New', 
    bg: 'bg-[#4ADE80]', 
    shadow: 'shadow-[#16A34A]',
    glow: 'hover:shadow-[0_0_20px_rgba(74,222,128,0.4)]'
  },
];

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const playSound = useCallback(() => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Main Bar: Soft White Glass */}
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b-4 border-slate-100 dark:border-zinc-800 rounded-[2rem] shadow-xl flex items-center justify-between px-4 py-2 md:px-6 md:py-3 transition-all duration-500">
            
            {/* Logo */}
            <Link to="/" onClick={playSound} className="flex items-center gap-3 group">
              <motion.div
                className="bg-gradient-to-br from-[#FF6B98] to-[#FF4E88] p-2.5 rounded-2xl shadow-lg shadow-pink-200 dark:shadow-none"
                whileHover={{ scale: 1.1, rotate: [-5, 5, 0] }}
              >
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
              </motion.div>
              <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
                welove<span className="text-[#FF6B98]">mods</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            {!isMobile && (
              <nav className="flex items-center gap-4">
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

            {/* Actions - Only mobile menu button remains */}
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[#FFB347] text-white shadow-[0_4px_0_0_#E68A00] active:translate-y-1 active:shadow-none transition-all"
                >
                  <Menu />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <div className="fixed inset-0 z-[70] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/60 backdrop-blur-md"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-[75%] bg-white dark:bg-zinc-950 shadow-2xl p-8 flex flex-col gap-6"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-black text-slate-800 dark:text-white">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-slate-400"><X /></button>
              </div>

              {NAV_CONFIG.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => { playSound(); setIsMenuOpen(false); }}
                  className={`flex items-center gap-4 px-6 py-4 rounded-3xl font-black text-white text-xl shadow-[0_6px_0_0_rgba(0,0,0,0.1)] transition-all active:scale-95 ${item.bg}`}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </Link>
              ))}
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
      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-white transition-all duration-200 
        ${bg} ${glow} ${active ? 'translate-y-1 shadow-none' : `shadow-[0_5px_0_0_rgba(0,0,0,0.1)] ${shadow} hover:-translate-y-0.5`}
      `}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className={`w-5 h-5 ${active ? 'animate-bounce' : ''}`} />
      <span className="hidden lg:inline">{label}</span>
      
      {active && (
        <motion.div 
          layoutId="navGlow"
          className="absolute inset-0 rounded-2xl bg-white/20"
          initial={false}
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
        />
      )}
    </motion.div>
  </Link>
);

export default Navbar;