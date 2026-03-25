import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const ORANGE = "#FF6B2C";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="hidden sm:block py-6 border-t"
      style={{
        background: "rgba(255,255,255,0.92)",
        borderColor: "rgba(255,107,44,0.15)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between sm:flex-row gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <span
              className="p-1.5 rounded-lg"
              style={{ background: `linear-gradient(135deg, ${ORANGE}, #E8541A)` }}
            >
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-[hsl(var(--foreground))]">
              welove<span style={{ color: ORANGE }}>mods</span>
            </span>
          </Link>

          <nav className="flex gap-6 text-sm font-semibold text-[hsl(var(--muted-foreground))]">
            <Link to="/categories" className="hover:text-[hsl(var(--foreground))] transition-colors">
              Categories
            </Link>
            <Link to="/top-games" className="hover:text-[hsl(var(--foreground))] transition-colors">
              Top Games
            </Link>
            <Link to="/new-games" className="hover:text-[hsl(var(--foreground))] transition-colors">
              New Games
            </Link>
          </nav>
        </div>
        <div className="mt-4 text-center text-xs font-medium text-[hsl(var(--muted-foreground))]">
          © {currentYear} WeLoveMods. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
