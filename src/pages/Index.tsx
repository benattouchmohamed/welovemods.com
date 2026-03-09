import React, { useEffect, useState, useRef, useMemo, memo } from "react";
import { Search, X, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import { fetchGames } from "@/services/gameService";
import type { Game } from "@/services/gameService";

const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 300;

const SkeletonCard = memo(() => (
  <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-3 shadow-[var(--shadow-blue)] animate-pulse">
    <div className="aspect-square bg-[hsl(var(--muted))] rounded-lg mb-3" />
    <div className="h-4 bg-[hsl(var(--muted))] rounded-full mb-2" />
    <div className="h-3 bg-[hsl(var(--muted))] rounded-full w-2/3" />
  </div>
));

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Index = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery.trim().toLowerCase(), SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const allGames = await fetchGames();
        if (!isMounted) return;
        setGames(allGames);
      } catch (e) {
        console.error("Fetch Error:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const filteredGames = useMemo(() => {
    if (!debouncedSearchQuery) return games;
    return games.filter(g =>
      g.title.toLowerCase().includes(debouncedSearchQuery) ||
      g.description.toLowerCase().includes(debouncedSearchQuery)
    );
  }, [games, debouncedSearchQuery]);

  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  const displayedGames = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGames.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGames, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearchQuery]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [currentPage]);

  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return games
      .filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [games, searchQuery]);

  const createSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  return (
    <div className="min-h-screen bg-[hsl(var(--card))] flex flex-col">
      <Helmet>
        <title>WeLoveMods | Top Game Mods – 2026</title>
      </Helmet>

      {/* Search Header */}
      <header className="w-full px-4 pt-20 pb-8 text-center z-50">
        {/* <div className="flex flex-col items-center gap-1 mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">
            Find your Mod
          </h1>
          <span
            className="h-1 w-12 rounded-full"
            style={{
              background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
            }}
          />
        </div> */}
<br /><br />
        <section className="w-full max-w-md mx-auto relative" ref={searchRef}>
          {/* Search Box */}
          <div
            className="relative flex items-center px-4 py-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] transition-all duration-200 focus-within:shadow-[var(--shadow-lg)]"
            style={{ boxShadow: "var(--shadow-blue)" }}
          >
            <Search className="w-5 h-5 text-[hsl(var(--muted-foreground))]" strokeWidth={2} />
            <input
              type="search"
              placeholder="Search 1,000+ mods..."
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              className="ml-3 flex-1 bg-transparent text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] outline-none text-base font-semibold"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}>
                <X className="w-4 h-4 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors" strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-[110%] left-0 right-0 bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] overflow-hidden z-[100]"
                style={{ boxShadow: "var(--shadow-lg)" }}
              >
                <div className="px-4 py-2.5 border-b border-[hsl(var(--border))] flex items-center gap-2 text-[11px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest">
                  <TrendingUp size={12} strokeWidth={2} /> Suggestions
                </div>
                {suggestions.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => {
                      navigate(`/game/${createSlug(game.title)}`);
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--muted))] transition-colors border-b border-[hsl(var(--border))] last:border-0 text-left"
                  >
                    <img
                      src={game.image_url}
                      alt=""
                      className="w-9 h-9 rounded-lg object-cover border border-[hsl(var(--border))]"
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-[hsl(var(--foreground))] truncate">{game.title}</p>
                      <p className="text-[11px] text-[hsl(var(--muted-foreground))] font-medium">v{game.version}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Game count */}
        {!isLoading && (
          <p className="mt-4 text-xs font-medium text-[hsl(var(--muted-foreground))]">
            {filteredGames.length} {filteredGames.length === 1 ? "game" : "games"} found
          </p>
        )}
      </header>

      {/* Main Grid */}
      <main className="flex-1 w-full px-4 md:px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {isLoading
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
            : displayedGames.map((game) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-14">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] disabled:opacity-30 transition-all hover:shadow-[var(--shadow-base)]"
              style={{ boxShadow: "var(--shadow-blue)" }}
            >
              <ChevronLeft size={20} strokeWidth={2} className="text-[hsl(var(--foreground))]" />
            </button>

            <div className="flex gap-1.5">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10 h-10 rounded-xl font-bold text-sm transition-all border"
                      style={
                        currentPage === pageNum
                          ? {
                              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                              color: "white",
                              borderColor: "transparent",
                              boxShadow: "var(--shadow-base)",
                            }
                          : {
                              background: "hsl(var(--card))",
                              color: "hsl(var(--foreground))",
                              borderColor: "hsl(var(--border))",
                              boxShadow: "var(--shadow-blue)",
                            }
                      }
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (Math.abs(pageNum - currentPage) === 2) {
                  return (
                    <span key={pageNum} className="self-center px-1 text-[hsl(var(--muted-foreground))] font-medium text-sm">
                      …
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] disabled:opacity-30 transition-all hover:shadow-[var(--shadow-base)]"
              style={{ boxShadow: "var(--shadow-blue)" }}
            >
              <ChevronRight size={20} strokeWidth={2} className="text-[hsl(var(--foreground))]" />
            </button>
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
};

export default Index;