import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import { fetchGames } from "@/services/gameService";
import type { Game } from "@/services/gameService";

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      try {
        const g = await fetchGames();
        setGames(g);
        setFilteredGames(g);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    setFilteredGames(
      q
        ? games.filter(
            (g) =>
              g.title.toLowerCase().includes(q) ||
              g.description.toLowerCase().includes(q)
          )
        : games
    );
  }, [searchQuery, games]);

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
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:title" content="WeLoveMods - Download Android Game Mods & APKs 2025" />
        <meta
          property="og:description"
          content="Download the latest Android game mods with unlimited coins, unlocked features, and cheats in 2025. Safe and free game APKs at WeLoveMods."
        />
        <meta property="og:image" content="https://yourdomain.com/assets/logo.jpg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://yourdomain.com" />
        <meta property="twitter:title" content="WeLoveMods - Download Android Game Mods & APKs 2025" />
        <meta
          property="twitter:description"
          content="Download the latest Android game mods with unlimited coins, unlocked features, and cheats in 2025. Safe and free game APKs at WeLoveMods."
        />
        <meta property="twitter:image" content="https://yourdomain.com/assets/logo.jpg" />
        <link rel="canonical" href="https://yourdomain.com" />
      </Helmet>

      {/* Logo */}
      <div className="mt-8 mb-4 flex items-center gap-3 px-6 py-3 rounded-2xl bg-white shadow-md border border-sky-200">
        {/* Your logo content */}
      </div>
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

      {/* Games Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md px-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-sky-200 rounded-2xl p-3 shadow-sm animate-pulse"
            >
              <div className="aspect-square bg-sky-100 rounded-xl mb-3"></div>
              <div className="h-4 bg-sky-200 rounded-full mb-2"></div>
              <div className="h-3 bg-orange-200 rounded-full w-2/3"></div>
            </div>
          ))
        ) : filteredGames.length > 0 ? (
          filteredGames.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p className="col-span-2 text-center text-sky-700 font-bold">
            No games found.
          </p>
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