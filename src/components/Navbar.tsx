// src/components/Navbar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, Flame, Sparkles, Moon, Sun, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Heart } from "lucide-react";

// Define interface for nav links to ensure type safety
interface NavLink {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  // Navigation links array
  const navLinks: NavLink[] = [
    { to: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { to: '/categories', icon: <List className="w-5 h-5" />, label: 'Categories' },
    { to: '/top-games', icon: <Flame className="w-5 h-5" />, label: 'Top' },
    { to: '/new-games', icon: <Sparkles className="w-5 h-5" />, label: 'New' },
  ];

  // Color classes for nav links
  const colors = [
    'bg-cartoon-red hover:bg-cartoon-red/80 dark:bg-cartoon-dark-red dark:hover:bg-cartoon-dark-red/80',
    'bg-cartoon-blue hover:bg-cartoon-blue/80 dark:bg-cartoon-dark-blue dark:hover:bg-cartoon-dark-blue/80',
    'bg-cartoon-purple hover:bg-cartoon-purple/80 dark:bg-cartoon-dark-purple dark:hover:bg-cartoon-dark-purple/80',
    'bg-cartoon-green hover:bg-cartoon-green/80 dark:bg-cartoon-dark-green dark:hover:bg-cartoon-dark-green/80',
  ];

  // Play sound on click
  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.play().catch((err) => console.warn('Audio playback failed:', err));
  };

  return (
    <>
      {/* Top Navbar (Desktop & Tablet) */}
      <header className="fixed top-0 left-0 right-0 z-50 p-3">
        <div className="mx-auto max-w-7xl px-4">
          <div className="bg-cartoon-cream dark:bg-cartoon-dark-cream border-4 border-cartoon-orange dark:border-cartoon-dark-orange rounded-full px-4 py-2 shadow-cartoon flex items-center justify-between">
            {/* Logo */}
          <Link to="/" onClick={playSound} className="flex items-center gap-2 group">
  <motion.div
    className="bg-cartoon-red dark:bg-cartoon-dark-red p-2 rounded-xl shadow-cartoon-sm"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <Heart className="w-5 h-5 text-white" />
  </motion.div>
  <span className="text-lg font-black text-cartoon-orange dark:text-cartoon-dark-orange">
    welovemods
  </span>
</Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-3">
              {navLinks.map((link, idx) => (
                <DesktopNavLink
                  key={link.to}
                  {...link}
                  color={colors[idx % colors.length]}
                  onClick={playSound}
                />
              ))}
            </nav>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                toggleTheme();
                playSound();
              }}
              className="rounded-full p-2 text-white shadow-cartoon-sm bg-cartoon-red hover:bg-cartoon-red/80 dark:bg-cartoon-dark-red dark:hover:bg-cartoon-dark-red/80"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Compact Mobile Bottom Nav */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cartoon-cream dark:bg-cartoon-dark-cream border-t-4 border-cartoon-orange dark:border-cartoon-dark-orange px-1 py-1 shadow-inner">
          <div className="flex max-w-sm mx-auto gap-1">
            {navLinks.map((link, idx) => (
              <MobileNavLink
                key={link.to}
                {...link}
                color={colors[idx % colors.length]}
                onClick={playSound}
              />
            ))}
          </div>
        </nav>
      )}
    </>
  );
};

// Desktop navigation link component
const DesktopNavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}> = ({ to, icon, label, color, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
        active ? 'ring-2 ring-white' : ''
      } ${color}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

// Mobile navigation link component
const MobileNavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}> = ({ to, icon, label, color, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex flex-col items-center justify-center flex-1 h-12 rounded-lg text-white text-[11px] font-bold transition-transform ${
        active ? 'scale-105 ring-2 ring-white' : 'hover:scale-105'
      } ${color}`}
    >
      {icon}
      <span className="mt-0.5">{label}</span>
    </Link>
  );
};

export default Navbar;