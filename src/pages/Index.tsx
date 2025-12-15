import React, { useEffect, useState, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import { fetchGames } from "@/services/gameService";
import type { Game } from "@/services/gameService";

const INITIAL_LOAD = 10;
const LOAD_MORE = 10;

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [displayedGames, setDisplayedGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load all games once (but we'll display in chunks)
  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      try {
        const allGames = await fetchGames();
        setGames(allGames);
        setFilteredGames(allGames);
        setDisplayedGames(allGames.slice(0, INITIAL_LOAD));
        setHasMore(allGames.length > INITIAL_LOAD);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Filter based on search
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    const newFiltered = q
      ? games.filter(
          (g) =>
            g.title.toLowerCase().includes(q) ||
            g.description.toLowerCase().includes(q)
        )
      : games;

    setFilteredGames(newFiltered);
    setDisplayedGames(newFiltered.slice(0, INITIAL_LOAD));
    setHasMore(newFiltered.length > INITIAL_LOAD);
  }, [searchQuery, games]);

  // Load more handler
  const loadMoreGames = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    setTimeout(() => {
      // Simulate appending next chunk (in real case it's instant)
      setDisplayedGames((prev) => {
        const nextStart = prev.length;
        const nextGames = filteredGames.slice(nextStart, nextStart + LOAD_MORE);
        const newDisplayed = [...prev, ...nextGames];
        if (nextStart + LOAD_MORE >= filteredGames.length) {
          setHasMore(false);
        }
        return newDisplayed;
      });
      setIsLoadingMore(false);
    }, 300); // Small delay for smooth feel, remove if not needed
  }, [filteredGames, isLoadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreGames();
        }
      },
      { rootMargin: "200px" } // Load a bit early
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreGames, hasMore, isLoadingMore]);

  const DOMAIN = "https://welovemods.com";

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-orange-50 flex flex-col items-center">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>WeLoveMods - Download Android Game Mods & APKs 2025</title>
        <meta
          name="description"
          content="Download the latest Android game mods with unlimited coins, unlocked features, and cheats in 2025. Safe and free game APKs at WeLoveMods."
        />
        <meta
          name="keywords"
          content="Android game mods, mod APK 2025, unlimited coins APK, game cheats 2025, free mods, WeLoveMods, modded games"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={DOMAIN} />
        <meta property="og:title" content="WeLoveMods - Download Android Game Mods & APKs 2025" />
        <meta
          property="og:description"
          content="Download the latest Android game mods with unlimited coins, unlocked features, and cheats in 2025. Safe and free game APKs at WeLoveMods."
        />
        <meta property="og:image" content={`${DOMAIN}/assets/logo.jpg`} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={DOMAIN} />
        <meta property="twitter:title" content="WeLoveMods - Download Android Game Mods & APKs 2025" />
        <meta
          property="twitter:description"
          content="Download the latest Android game mods with unlimited coins, unlocked features, and cheats in 2025. Safe and free game APKs at WeLoveMods."
        />
        <meta property="twitter:image" content={`${DOMAIN}/assets/logo.jpg`} />
        <link rel="canonical" href={DOMAIN} />
      </Helmet>

      {/* Logo */}
      <div className="mt-8 mb-4 flex items-center gap-3 px-6 py-3 rounded-2xl bg-white shadow-md border border-sky-200">
        {/* Your logo content */}
      </div>
      <br />
 <br />
      {/* Search */}
      <div className="w-full max-w-md px-6 mb-8">
        <div className="flex items-center px-4 py-3 rounded-full bg-white shadow-sm border border-sky-200">
          <Search className="w-5 h-5 text-sky-500 mr-3" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sky-700 placeholder-sky-400 outline-none font-medium"
          />
        </div>
      </div>

      {/* Games Grid - Responsive: 2 cols mobile, 4 cols on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-md md:max-w-4xl px-6">
        {isLoading ? (
          [...Array(INITIAL_LOAD)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-sky-200 rounded-2xl p-3 shadow-sm animate-pulse"
            >
              <div className="aspect-square bg-sky-100 rounded-xl mb-3"></div>
              <div className="h-4 bg-sky-200 rounded-full mb-2"></div>
              <div className="h-3 bg-orange-200 rounded-full w-2/3"></div>
            </div>
          ))
        ) : displayedGames.length > 0 ? (
          displayedGames.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p className="col-span-2 md:col-span-4 text-center text-sky-700 font-bold">
            No games found.
          </p>
        )}

        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="col-span-2 md:col-span-4 text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500"></div>
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        {hasMore && !isLoading && (
          <div ref={sentinelRef} className="col-span-2 md:col-span-4 h-10" />
        )}
      </div>

      <br />
      <br />
      <br />

      {/* Bottom Nav */}
      <div className="mt-auto w-full"> 
        <Navbar />
      </div>
    </div>
  );
};

export default Index;