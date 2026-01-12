import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // For smooth transitions
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import { fetchGames } from "@/services/gameService";
import type { Game } from "@/services/gameService";

// --- Configuration ---
const INITIAL_LOAD = 12;
const LOAD_MORE = 12;
const SEARCH_DEBOUNCE_MS = 300;
const DOMAIN = "https://welovemods.com";

/**
 * SkeletonCard: Memoized to prevent unnecessary re-renders.
 * Optimized for 3-column mobile and 4-column PC.
 */
const SkeletonCard = memo(() => (
  <div className="bg-white border border-sky-200 rounded-2xl p-3 shadow-sm animate-pulse">
    <div className="aspect-square bg-sky-100 rounded-xl mb-3" />
    <div className="h-4 bg-sky-200 rounded-full mb-2" />
    <div className="h-3 bg-orange-100 rounded-full w-2/3" />
  </div>
));
SkeletonCard.displayName = "SkeletonCard";

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
  const [displayedGames, setDisplayedGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const allGames = await fetchGames();
        if (!isMounted) return;
        setGames(allGames);
        setDisplayedGames(allGames.slice(0, INITIAL_LOAD));
        setHasMore(allGames.length > INITIAL_LOAD);
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

  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return games
      .filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [games, searchQuery]);

  useEffect(() => {
    setDisplayedGames(filteredGames.slice(0, INITIAL_LOAD));
    setHasMore(filteredGames.length > INITIAL_LOAD);
  }, [filteredGames]);

  const loadMoreGames = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    requestAnimationFrame(() => {
      setDisplayedGames(prev => {
        const nextStart = prev.length;
        const nextChunk = filteredGames.slice(nextStart, nextStart + LOAD_MORE);
        const newDisplayed = [...prev, ...nextChunk];
        setHasMore(newDisplayed.length < filteredGames.length);
        return newDisplayed;
      });
      setIsLoadingMore(false);
    });
  }, [filteredGames, isLoadingMore, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMoreGames();
        }
      },
      { rootMargin: "600px" }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMoreGames, hasMore, isLoadingMore, isLoading]);

  const createSlug = (title: string) => 
    title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Helmet>
        <title>WeLoveMods | Top Game Mods for iPhone & Android – 2026 Update</title>
      </Helmet>

      {/* Header & Search */}
      <header className="w-full px-4 pt-20 pb-6 text-center z-50"> <br />
        <section className="w-full max-w-md mx-auto relative" ref={searchRef}>
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

          {/* Search Suggestions */}
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

      {/* Main Grid */}
      <main className="flex-1 w-full px-2 md:px-6 pb-24">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-6 max-w-6xl mx-auto">
          {isLoading ? (
            // Show Skeletons during initial load
            Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <AnimatePresence>
              {displayedGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }} // Subtle staggered entrance
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Infinite Scroll & Loader */}
          <div ref={sentinelRef} className="h-20 col-span-full flex justify-center items-center">
            {isLoadingMore && (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-sky-600" />
            )}
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
};

export default Index;