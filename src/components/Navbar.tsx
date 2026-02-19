import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, Flame, Sparkles, Heart, X, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

// --- Theme Aligned Config: Using Brand colors and Neobrutalist shadows ---
const NAV_CONFIG = [
  { 
    to: '/', 
    icon: Home, 
    label: 'Home', 
    bg: 'bg-[#FF814D]', // Brand Orange
  },
  { 
    to: '/categories', 
    icon: List, 
    label: 'Cats', 
    bg: 'bg-[#4FB39A]', // Brand Teal
  },
  { 
    to: '/top-games', 
    icon: Flame, 
    label: 'Top', 
    bg: 'bg-[#FF70C1]', // Brand Pink
  },
  { 
    to: '/new-games', 
    icon: Sparkles, 
    label: 'New', 
    bg: 'bg-yellow-400', 
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
      {/* Header with High Contrast Neobrutalism */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between px-4 py-2 md:px-8 md:py-3 transition-all">
            
            {/* Logo - Matching Youform Hero Style */}
            <Link to="/" onClick={playSound} className="flex items-center gap-2 group">
              <motion.div
                className="bg-[#FF814D] p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                whileHover={{ scale: 1.05, rotate: -5 }}
              >
                <Heart className="w-5 h-5 text-black fill-black" />
              </motion.div>
              <span className="text-xl md:text-2xl font-black text-black tracking-tighter uppercase">
                welove<span className="text-[#FF814D]">mods</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
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

            {/* Mobile Menu Button - Hard Border Style */}
            {isMobile && (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-black bg-[#FDF4D3] text-black active:translate-y-[2px] active:shadow-none transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[80%] max-w-sm bg-[#FDF4D3] h-full border-l-4 border-black p-6 flex flex-col gap-4 shadow-[-8px_0px_0px_0px_rgba(0,0,0,0.1)]"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-black text-black uppercase tracking-tight">Explore</span>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 border-2 border-black bg-white rounded-full text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              {NAV_CONFIG.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => { playSound(); setIsMenuOpen(false); }}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl font-black text-black text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all ${item.bg}`}
                >
                  <div className="bg-white border-2 border-black p-2 rounded-lg">
                    <item.icon className="w-5 h-5" strokeWidth={3} />
                  </div>
                  <span className="uppercase tracking-tight">{item.label}</span>
                </Link>
              ))}
              
              <div className="mt-auto p-4 bg-white border-2 border-black rounded-2xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                <p className="text-xs font-black text-black uppercase tracking-widest">Version 2.0.26</p>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const DesktopNavLink = ({ to, icon: Icon, label, bg, active, onClick }: any) => (
  <Link to={to} onClick={onClick} className="relative group">
    <motion.div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-black text-sm border-2 border-black transition-all duration-200 
        ${bg} ${active ? 'translate-y-[2px] shadow-none' : 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'}
      `}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className={`w-4 h-4 text-black`} strokeWidth={3} />
      <span className="uppercase tracking-tight">{label}</span>
    </motion.div>
  </Link>
);

export default Navbar;