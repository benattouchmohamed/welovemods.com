import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Flame, Sparkles, Gamepad2, X, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_CONFIG = [
  { to: '/',           icon: Home,       label: 'Home' },
  { to: '/categories', icon: LayoutGrid, label: 'Categories' },
  { to: '/top-games',  icon: Flame,      label: 'Top' },
  { to: '/new-games',  icon: Sparkles,   label: 'New' },
];

const ORANGE = '#FF6B2C';
const ORANGE_DARK = '#D4521A';
const ORANGE_SHADOW = '0 4px 0 #C04A17';

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
      <header className="fixed top-0 left-0 right-0 z-[100] px-3 py-2.5 md:px-6 md:py-3">
        <div className="mx-auto max-w-5xl">
          <nav
            className="relative flex items-center justify-between px-4 py-2 md:px-5 md:py-2.5 rounded-2xl bg-[hsl(var(--card))]"
            style={{
              border: `3px solid ${ORANGE}`,
              boxShadow: `0 6px 0 ${ORANGE_DARK}, 0 8px 16px rgba(255,107,44,0.2)`,
            }}
          >
            {/* Logo */}
            <Link to="/" onClick={playSound} className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -6 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                  border: `3px solid ${ORANGE_DARK}`,
                  boxShadow: ORANGE_SHADOW,
                }}
              >
                <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={2.5} />
                <span className="absolute inset-0 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)' }} />
              </motion.div>
              <span className="text-lg md:text-xl font-black tracking-tight text-[hsl(var(--foreground))]">
                welove<span style={{ color: ORANGE }}>mods</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            {!isMobile && (
              <div className="flex items-center gap-1">
                {NAV_CONFIG.map((item) => (
                  <DesktopNavLink
                    key={item.to}
                    {...item}
                    active={pathname === item.to}
                    onClick={playSound}
                  />
                ))}
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setIsMenuOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{
                  background: 'rgba(255,107,44,0.1)',
                  border: `2.5px solid ${ORANGE}`,
                  color: ORANGE,
                  boxShadow: '0 3px 0 #C04A17',
                }}
              >
                <Menu size={18} strokeWidth={2.5} />
              </motion.button>
            )}
          </nav>
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
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 200 }}
              className="relative w-[78%] max-w-xs h-full p-5 flex flex-col gap-2 bg-[hsl(var(--card))]"
              style={{
                borderLeft: `3px solid ${ORANGE}`,
                boxShadow: `-6px 0 30px rgba(255,107,44,0.2)`,
              }}
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" strokeWidth={2.5} style={{ color: ORANGE }} />
                  <span className="text-lg font-black text-[hsl(var(--foreground))]">Menu</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl"
                  style={{
                    background: 'rgba(255,107,44,0.1)',
                    border: `2px solid ${ORANGE}`,
                    color: ORANGE,
                  }}
                >
                  <X size={14} strokeWidth={3} />
                </motion.button>
              </div>

              {/* Nav Links */}
              {NAV_CONFIG.map((item, i) => {
                const isActive = pathname === item.to;
                return (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => { playSound(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200"
                      style={isActive ? {
                        background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                        color: 'white',
                        border: `2.5px solid ${ORANGE_DARK}`,
                        boxShadow: ORANGE_SHADOW,
                      } : {
                        background: 'rgba(255,107,44,0.08)',
                        color: 'hsl(var(--foreground))',
                        border: '2.5px solid transparent',
                      }}
                    >
                      <span
                        className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
                        style={{
                          background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,107,44,0.12)',
                        }}
                      >
                        <item.icon className="w-4 h-4" strokeWidth={2.5} style={{ color: isActive ? 'white' : ORANGE }} />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Footer */}
              <div className="mt-auto px-4 py-2.5 rounded-xl text-center"
                style={{ background: 'rgba(255,107,44,0.08)', border: `2px solid ${ORANGE}` }}>
                <p className="text-[11px] font-bold" style={{ color: ORANGE }}>v2.0.26</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const DesktopNavLink = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link to={to} onClick={onClick}>
    <motion.div
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -2 }}
      className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200"
      style={active ? {
        background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
        color: 'white',
        border: `2.5px solid ${ORANGE_DARK}`,
        boxShadow: ORANGE_SHADOW,
      } : {
        color: '#666',
        border: '2.5px solid transparent',
      }}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
      <span>{label}</span>
    </motion.div>
  </Link>
);

export default Navbar;
