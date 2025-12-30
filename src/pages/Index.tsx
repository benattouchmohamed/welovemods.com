import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import { fetchGames } from "@/services/gameService";
import type { Game } from "@/services/gameService";

const INITIAL_LOAD = 12;
const LOAD_MORE = 12;
const SEARCH_DEBOUNCE_MS = 300;

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [displayedGames, setDisplayedGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery.trim().toLowerCase(), SEARCH_DEBOUNCE_MS);

  // Load all games once
  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      try {
        const allGames = await fetchGames();
        setGames(allGames);
        setDisplayedGames(allGames.slice(0, INITIAL_LOAD));
        setHasMore(allGames.length > INITIAL_LOAD);
      } catch (e) {
        console.error("Failed to fetch games:", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Memoized filtered games based on debounced query
  const filteredGames = useMemo(() => {
    if (!debouncedSearchQuery) return games;

    return games.filter(
      (g) =>
        g.title.toLowerCase().includes(debouncedSearchQuery) ||
        g.description.toLowerCase().includes(debouncedSearchQuery)
    );
  }, [games, debouncedSearchQuery]);

  // Reset displayed games when filter changes
  useEffect(() => {
    setDisplayedGames(filteredGames.slice(0, INITIAL_LOAD));
    setHasMore(filteredGames.length > INITIAL_LOAD);
  }, [filteredGames]);

  // Load more games
  const loadMoreGames = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    requestAnimationFrame(() => {
      setDisplayedGames((prev) => {
        const nextStart = prev.length;
        const nextChunk = filteredGames.slice(nextStart, nextStart + LOAD_MORE);
        const newDisplayed = [...prev, ...nextChunk];

        if (nextStart + LOAD_MORE >= filteredGames.length) {
          setHasMore(false);
        }
        return newDisplayed;
      });
      setIsLoadingMore(false);
    });
  }, [filteredGames, isLoadingMore, hasMore]);

  // Intersection Observer setup
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreGames();
        }
      },
      {
        rootMargin: "400px", // Load earlier for smoother experience
        threshold: 0.1,
      }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [loadMoreGames, hasMore, isLoadingMore]);

  const DOMAIN = "https://welovemods.com";

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-orange-50 flex flex-col">
      <Helmet>
        <title>WeLoveMods - Download Android Game Mods & APKs 2025</title>
        <meta
          name="description"
          content="Download the latest Android game mods with unlimited coins, unlocked features, and cheats in 2025. Safe and free game APKs at WeLoveMods."
        />
        <meta
          name="keywords"
          content="Android game mods, mod APK 2025, unlimited coins APK, game cheats 2025, free mods, WeLoveMods"
        />
        <link rel="canonical" href={DOMAIN} />
        {/* Other OG/Twitter tags... */}
      </Helmet>

      {/* Header */}
      <header className="w-full px-6 pt-8 pb-6 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white shadow-md border border-sky-200 mb-6">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-sky-700">WeLoveMods</h1>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center px-5 py-4 rounded-full bg-white shadow-md border border-sky-200 transition-shadow hover:shadow-lg">
            <Search className="w-5 h-5 text-sky-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-3 flex-1 bg-transparent text-sky-800 placeholder-sky-400 outline-none font-medium"
              autoFocus={false}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-sky-400 hover:text-sky-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Games Grid */}
      <main className="flex-1 w-full px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-md md:max-w-5xl mx-auto">
          {isLoading
            ? Array.from({ length: INITIAL_LOAD }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : displayedGames.length > 0
            ? displayedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))
            : (
                <div className="col-span-full text-center py-12">
                  <p className="text-xl font-semibold text-sky-700">
                    No games found for "{searchQuery}"
                  </p>
                  <p className="text-sky-600 mt-2">Try a different search term</p>
                </div>
              )}

          {/* Load more spinner */}
          {isLoadingMore && (
            <div className="col-span-full flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-b-3 border-sky-600"></div>
            </div>
          )}

          {/* Sentinel */}
          {hasMore && <div ref={sentinelRef} className="h-20 col-span-full" />}
        </div>
      </main>

      {/* Fixed Bottom Navbar */}
      <Navbar />
    </div>
  );
};

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Skeleton component
const SkeletonCard = memo(() => (
  <div className="bg-white border border-sky-200 rounded-2xl p-4 shadow-sm animate-pulse">
    <div className="aspect-square bg-sky-100 rounded-xl mb-4"></div>
    <div className="h-5 bg-sky-200 rounded-full mb-3"></div>
    <div className="h-4 bg-orange-200 rounded-full w-3/4"></div>
  </div>
));

export default Index;