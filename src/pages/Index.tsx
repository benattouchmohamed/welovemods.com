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

// Update Skeleton to match the "Card" aesthetic
const SkeletonCard = memo(() => (
  <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
    <div className="aspect-square bg-gray-100 rounded-lg mb-3" />
    <div className="h-4 bg-gray-200 rounded-full mb-2" />
    <div className="h-3 bg-gray-100 rounded-full w-2/3" />
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
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage]);

  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return games
      .filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [games, searchQuery]);

  const createSlug = (title: string) => 
    title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  return (
    <div className="min-h-screen bg-[#FDF4D3] flex flex-col font-sans">
      <Helmet>
        <title>WeLoveMods | Top Game Mods – 2026</title>
      </Helmet>

      {/* Header with Styled Search */}
      <header className="w-full px-4 pt-16 pb-8 text-center z-50">
       <br /> <br />
        <section className="w-full max-w-md mx-auto relative" ref={searchRef}>
          <div className="relative flex items-center px-4 py-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus-within:translate-x-[-2px] focus-within:translate-y-[-2px] focus-within:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Search className="w-6 h-6 text-black" strokeWidth={3} />
            <input
              type="search"
              placeholder="Search 1,000+ mods..."
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              className="ml-3 flex-1 bg-transparent text-black placeholder-gray-400 outline-none text-lg font-extrabold"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}>
                <X className="w-5 h-5 text-black" strokeWidth={3} />
              </button>
            )}
          </div>
          
          {/* Suggestions Dropdown with Neobrutalist style */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-[110%] left-0 right-0 bg-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-[100]"
              >
                <div className="p-3 border-b-2 border-black bg-[#FF70C1] flex items-center gap-2 text-xs font-black text-black uppercase tracking-widest">
                  <TrendingUp size={14} strokeWidth={3} /> Suggestions
                </div>
                {suggestions.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => {
                      navigate(`/game/${createSlug(game.title)}`);
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center gap-4 px-4 py-4 hover:bg-[#FDF4D3] transition-colors border-b-2 border-black last:border-0 text-left"
                  >
                    <img src={game.image_url} alt="" className="w-10 h-10 rounded-lg border-2 border-black object-cover" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-md font-black text-black truncate uppercase">{game.title}</p>
                      <p className="text-[12px] text-gray-600 font-bold uppercase">v{game.version}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </header>

      {/* Main Grid */}
      <main className="flex-1 w-full px-4 md:px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {isLoading ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            displayedGames.map((game) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
              >
                {/* Ensure GameCard inside also uses border-2 border-black */}
                <GameCard game={game} />
              </motion.div>
            ))
          )}
        </div>

        {/* --- Pagination Controls --- */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl bg-white border-2 border-black disabled:opacity-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-12 h-12 rounded-xl font-black text-lg transition-all border-2 border-black ${
                        currentPage === pageNum 
                        ? "bg-[#FF814D] shadow-none translate-y-[2px]" 
                        : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (Math.abs(pageNum - currentPage) === 2) {
                   return <span key={pageNum} className="self-end px-1 font-black">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl bg-white border-2 border-black disabled:opacity-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
};

export default Index;