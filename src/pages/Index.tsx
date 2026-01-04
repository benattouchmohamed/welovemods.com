import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { Search, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import { fetchGames } from "@/services/gameService";
import type { Game } from "@/services/gameService";

// --- Configuration & Constants ---
const INITIAL_LOAD = 12;
const LOAD_MORE = 12;
const SEARCH_DEBOUNCE_MS = 300;
const DOMAIN = "https://welovemods.com";

// --- Helper Components & Hooks ---

/**
 * useDebounce Hook: Delays search execution to save CPU/Memory
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

/**
 * SkeletonCard: Memoized to prevent re-renders during list updates
 * Improves perceived performance (Core Web Vitals)
 */
const SkeletonCard = memo(() => (
  <div className="bg-white border border-sky-200 rounded-2xl p-4 shadow-sm animate-pulse">
    <div className="aspect-square bg-sky-100 rounded-xl mb-4" />
    <div className="h-5 bg-sky-200 rounded-full mb-3" />
    <div className="h-4 bg-orange-200 rounded-full w-3/4" />
  </div>
));
SkeletonCard.displayName = "SkeletonCard";

// --- Main Page Component ---

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [displayedGames, setDisplayedGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery.trim().toLowerCase(), SEARCH_DEBOUNCE_MS);

  // 1. Initial Data Fetch
  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    const load = async () => {
      try {
        const allGames = await fetchGames();
        if (!isMounted) return;
        setGames(allGames);
        setDisplayedGames(allGames.slice(0, INITIAL_LOAD));
        setHasMore(allGames.length > INITIAL_LOAD);
      } catch (e) {
        console.error("SEO Error: Failed to fetch games for indexing", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  // 2. Optimized Filtering Logic
  const filteredGames = useMemo(() => {
    if (!debouncedSearchQuery) return games;
    return games.filter(
      (g) =>
        g.title.toLowerCase().includes(debouncedSearchQuery) ||
        g.description.toLowerCase().includes(debouncedSearchQuery)
    );
  }, [games, debouncedSearchQuery]);

  // Sync list when filter changes
  useEffect(() => {
    setDisplayedGames(filteredGames.slice(0, INITIAL_LOAD));
    setHasMore(filteredGames.length > INITIAL_LOAD);
  }, [filteredGames]);

  // 3. Load More Function (Performance Optimized)
  const loadMoreGames = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    // requestAnimationFrame ensures the browser is ready to paint
    requestAnimationFrame(() => {
      setDisplayedGames((prev) => {
        const nextStart = prev.length;
        const nextChunk = filteredGames.slice(nextStart, nextStart + LOAD_MORE);
        const newDisplayed = [...prev, ...nextChunk];
        setHasMore(newDisplayed.length < filteredGames.length);
        return newDisplayed;
      });
      setIsLoadingMore(false);
    });
  }, [filteredGames, isLoadingMore, hasMore]);

  // 4. Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreGames();
        }
      },
      { rootMargin: "600px" } // Pre-load 600px before user hits bottom
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMoreGames, hasMore, isLoadingMore]);

  // 5. Schema.org JSON-LD (Max SEO)
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "WeLoveMods - Android Game Mods & APKs 2026",
    "description": "Premium destination for safe, tested Android modded APKs.",
    "url": DOMAIN,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": displayedGames.slice(0, 12).map((game, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": game.title,
        "url": `${DOMAIN}/game/${game.id}`
      }))
    }
  }), [displayedGames]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-orange-50 flex flex-col">
      <Helmet>
        <title>WeLoveMods - Download Android Game Mods & APKs 2026</title>
        <meta name="description" content="Download the latest Android game mods with unlimited coins, unlocked features, and cheats in 2026. Safe and free game APKs at WeLoveMods." />
        <meta name="keywords" content="Android game mods, mod APK 2026, unlimited coins APK, game cheats, WeLoveMods" />
        <link rel="canonical" href={DOMAIN} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Semantic Header */}
      <header className="w-full px-6 pt-8 pb-6 text-center">
       
<br /><br /> <br />
        {/* Search Section */}
        <section className="w-full max-w-md mx-auto" aria-label="Game Search">
          <div className="relative flex items-center px-5 py-4 rounded-full bg-white shadow-md border border-sky-200 focus-within:ring-2 focus-within:ring-sky-400 transition-all">
            <label htmlFor="game-search" className="sr-only">Search for modded games</label>
            <Search className="w-5 h-5 text-sky-500" aria-hidden="true" />
            <input
              id="game-search"
              type="search"
              placeholder="Search 1,000+ mods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-3 flex-1 bg-transparent text-sky-800 placeholder-sky-400 outline-none font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="p-1 hover:bg-sky-50 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-sky-400" />
              </button>
            )}
          </div>
        </section>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 w-full px-4 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {isLoading ? (
            Array.from({ length: INITIAL_LOAD }).map((_, i) => <SkeletonCard key={i} />)
          ) : displayedGames.length > 0 ? (
            displayedGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))
          ) : (
            <article className="col-span-full text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-sky-200">
              <h2 className="text-xl font-bold text-sky-700">No results for "{searchQuery}"</h2>
              <p className="text-sky-600 mt-2">Try searching for "Menu" or "Unlimited"</p>
            </article>
          )}

          {/* Load More Indicator */}
          {isLoadingMore && (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-sky-600" role="status">
                <span className="sr-only">Loading more games...</span>
              </div>
            </div>
          )}

          {/* Scroll Target */}
          <div ref={sentinelRef} className="h-10 col-span-full" aria-hidden="true" />
        </div>
      </main>

      <Navbar />
    </div>
  );
};

export default Index;