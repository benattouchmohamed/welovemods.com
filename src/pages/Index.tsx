import React, { useEffect, useState, useRef, useMemo, memo } from "react";
import { Search, X, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import { fetchGames } from "@/services/gameService";
import type { Game } from "@/services/gameService";

// --- Configuration ---
const ITEMS_PER_PAGE = 12; 
const SEARCH_DEBOUNCE_MS = 300;

const SkeletonCard = memo(() => (
  <div className="bg-white border border-sky-200 rounded-2xl p-3 shadow-sm animate-pulse">
    <div className="aspect-square bg-sky-100 rounded-xl mb-3" />
    <div className="h-4 bg-sky-200 rounded-full mb-2" />
    <div className="h-3 bg-orange-100 rounded-full w-2/3" />
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

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initial Fetch
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

  // Filter logic
  const filteredGames = useMemo(() => {
    if (!debouncedSearchQuery) return games;
    return games.filter(g =>
      g.title.toLowerCase().includes(debouncedSearchQuery) ||
      g.description.toLowerCase().includes(debouncedSearchQuery)
    );
  }, [games, debouncedSearchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  const displayedGames = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGames.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGames, currentPage]);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return games
      .filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [games, searchQuery]);

  const createSlug = (title: string) => 
    title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  return (
    <div className="min-h-screen  bg-[#FFFBEB] flex flex-col">
      <Helmet>
        <title>WeLoveMods | Top Game Mods for iPhone & Android – 2026</title>
      </Helmet>

      <header className="w-full px-4 pt-20 pb-6 text-center z-50">
        <section className="w-full max-w-md mx-auto relative" ref={searchRef}> <br />
          <div className="relative flex items-center px-4 py-3 rounded-full bg-white shadow-xl shadow-sky-100/50 border border-sky-100 focus-within:ring-2 focus-within:ring-sky-400 transition-all">
            <Search className="w-5 h-5 text-sky-500" />
            <input
              type="search"
              placeholder="Search 1,000+ mods..."
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              className="ml-2 flex-1 bg-transparent text-slate-800 placeholder-slate-300 outline-none text-sm font-bold"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
          
          {/* Suggestions Dropdown (Same as before) */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100]"
              >
                <div className="p-2 border-b border-slate-50 flex items-center gap-2 text-[10px] font-black text-sky-400 px-4 uppercase tracking-widest">
                  <TrendingUp size={12} /> Suggestions
                </div>
                {suggestions.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => {
                      navigate(`/game/${createSlug(game.title)}`);
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sky-50 transition-colors border-b border-slate-50 last:border-0 text-left"
                  >
                    <img src={game.image_url} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-100" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-700 truncate">{game.title}</p>
                      <p className="text-[10px] text-sky-500 font-bold uppercase">v{game.version}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </header>

      <main className="flex-1 w-full px-2 md:px-6 pb-12">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-6 max-w-6xl mx-auto">
          {isLoading ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            displayedGames.map((game) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <GameCard game={game} />
              </motion.div>
            ))
          )}
        </div>

        {/* --- Pagination Controls --- */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 pb-10">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-sky-100 disabled:opacity-30 text-sky-600 shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Only show current, first, last, and neighbors for clean UI
                if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${
                        currentPage === pageNum 
                        ? "bg-sky-500 text-white shadow-lg shadow-sky-200" 
                        : "bg-white text-slate-600 border border-sky-50 hover:border-sky-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (Math.abs(pageNum - currentPage) === 2) {
                   return <span key={pageNum} className="px-1 text-slate-300">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-sky-100 disabled:opacity-30 text-sky-600 shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
};

export default Index;
