import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import { fetchGames } from "@/services/gameService";
import type { Game } from "@/services/gameService";

const TopGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadGames = async () => {
      try {
        const gamesData = await fetchGames();
        const sortedGames = [...gamesData].sort((a, b) => b.rating - a.rating);
        setGames(sortedGames);
        setFilteredGames(sortedGames);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGames();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGames(games);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredGames(
        games.filter(
          (g) =>
            g.title.toLowerCase().includes(q) ||
            g.description.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, games]);

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--card))]">
      <Helmet>
        <title>Top Rated MOD APK Games 2026 – Best Mods | WeLoveMods</title>
        <meta name="description" content="Discover the top rated MOD APK games of 2026. Highest rated mods with unlimited coins, premium unlocks. Free & safe download." />
        <link rel="canonical" href="https://welovemods.com/top-games" />
      </Helmet>
      <Navbar />

      <main className="flex-grow pt-16">
        <section className="py-10 sm:py-14 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <Link
                to="/"
                className="flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                Back
              </Link>

              <div className="flex flex-col items-center gap-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">
                  Top Games
                </h1>
                <span
                  className="h-1 w-12 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
                  }}
                />
              </div>

              <div className="w-12" />
            </div>

            {/* Search */}
            <div className="mb-5">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search top games..."
              />
            </div>

            {/* Subtitle + count */}
            <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-[hsl(var(--muted-foreground))] text-sm text-center sm:text-left max-w-xl">
                Discover the most popular and highest rated games loved by our community.
              </p>
              {!isLoading && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] shrink-0">
                  {filteredGames.length} {filteredGames.length === 1 ? "game" : "games"}
                </span>
              )}
            </div>

            {/* Grid */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredGames.map((game, index) => (
                  <div
                    key={game.id}
                    className="animate-stagger-fade-in"
                    style={{ animationDelay: `${index * 0.06}s` }}
                  >
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Top Games Found"
                description="Try adjusting your search query."
                icon={<Sparkles className="w-16 h-16 mx-auto text-[hsl(var(--muted-foreground))] mb-4" />}
              />
            )}
          </div>
        </section>
      </main>

      <div className="pb-10" />
    </div>
  );
};

export default TopGames;
