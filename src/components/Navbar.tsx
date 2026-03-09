import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, Flame, Sparkles, Heart, X, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_CONFIG = [
  { to: '/',           icon: Home,     label: 'Home'  },
  { to: '/categories', icon: List,     label: 'Cats'  },
  { to: '/top-games',  icon: Flame,    label: 'Top'   },
  { to: '/new-games',  icon: Sparkles, label: 'New'   },
];

const ORANGE = '#FF6B2C';
const ORANGE_DARK = '#E8541A';
const ORANGE_GLOW = 'rgba(255,107,44,0.35)';
const ORANGE_SOFT = 'rgba(255,107,44,0.10)';

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
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-3 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div
            className="relative flex items-center justify-between px-4 py-2.5 md:px-6 md:py-3 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(16px)',
              border: `1.5px solid rgba(255,107,44,0.25)`,
              boxShadow: `0 4px 24px ${ORANGE_GLOW}, 0 1px 0 rgba(255,255,255,0.8) inset`,
            }}
          >
            {/* Subtle orange top-edge glow line */}
            <span
              className="absolute top-0 left-8 right-8 h-[2px] rounded-full"
              style={{ background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)` }}
            />

            {/* Logo */}
            <Link to="/" onClick={playSound} className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -8 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                  boxShadow: `0 4px 12px ${ORANGE_GLOW}`,
                }}
              >
                <Heart className="w-4 h-4 text-white fill-white" />
                {/* Shine */}
                <span className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)' }} />
              </motion.div>
              <span className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900">
                welove<span style={{ color: ORANGE }}>mods</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            {!isMobile && (
              <nav className="flex items-center gap-1">
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

            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsMenuOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{
                  background: ORANGE_SOFT,
                  border: `1.5px solid rgba(255,107,44,0.3)`,
                  color: ORANGE,
                }}
              >
                <Menu size={18} strokeWidth={2.5} />
              </motion.button>
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
              className="absolute inset-0 bg-black/25 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-[75%] max-w-sm h-full p-6 flex flex-col gap-2.5"
              style={{
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(20px)',
                borderLeft: `2px solid rgba(255,107,44,0.2)`,
                boxShadow: `-8px 0 40px ${ORANGE_GLOW}`,
              }}
            >
              {/* Orange edge accent */}
              <span
                className="absolute left-0 top-12 bottom-12 w-[3px] rounded-full"
                style={{ background: `linear-gradient(180deg, transparent, ${ORANGE}, transparent)` }}
              />

              {/* Drawer Header */}
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: ORANGE, boxShadow: `0 0 8px ${ORANGE_GLOW}` }}
                  />
                  <span className="text-lg font-extrabold text-gray-900 tracking-tight">Explore</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl"
                  style={{ background: ORANGE_SOFT, color: ORANGE }}
                >
                  <X size={15} strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Nav Links */}
              {NAV_CONFIG.map((item, i) => {
                const isActive = pathname === item.to;
                return (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => { playSound(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                      style={
                        isActive
                          ? {
                              background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                              color: 'white',
                              boxShadow: `0 4px 16px ${ORANGE_GLOW}`,
                            }
                          : {
                              background: ORANGE_SOFT,
                              color: 'hsl(var(--foreground))',
                              border: `1px solid rgba(255,107,44,0.15)`,
                            }
                      }
                    >
                      <span
                        className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
                        style={{
                          background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,107,44,0.12)',
                        }}
                      >
                        <item.icon className="w-4 h-4" strokeWidth={2} style={{ color: isActive ? 'white' : ORANGE }} />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Footer */}
              <div className="mt-auto px-4 py-3 rounded-xl text-center"
                style={{ background: ORANGE_SOFT, border: `1px solid rgba(255,107,44,0.15)` }}>
                <p className="text-[11px] font-semibold" style={{ color: ORANGE }}>Version 2.0.26</p>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const DesktopNavLink = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link to={to} onClick={onClick}>
    <motion.div
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
      style={
        active
          ? {
              background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
              color: 'white',
              boxShadow: `0 4px 14px ${ORANGE_GLOW}`,
            }
          : {
              color: '#666',
              background: 'transparent',
            }
      }
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2} />
      <span>{label}</span>

      {/* Hover underline for inactive */}
      {!active && (
        <motion.span
          className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full opacity-0 group-hover:opacity-100"
          style={{ background: ORANGE }}
        />
      )}
    </motion.div>
  </Link>
);

export default Navbar;