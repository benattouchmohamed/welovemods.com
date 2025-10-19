import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Sparkles } from "lucide-react";
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

        // ✅ sort games by rating (highest first)
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
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredGames(
        games.filter(
          (game) =>
            game.title.toLowerCase().includes(lowerQuery) ||
            game.description.toLowerCase().includes(lowerQuery)
        )
      );
    }
  }, [searchQuery, games]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/50 to-background">
      <Navbar />

      <main className="flex-grow pt-16">
        <section className="py-10 sm:py-14 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
              <Link
                to="/"
                className="text-primary hover:text-primary/80 font-semibold flex items-center transition-colors group"
              >
                <ArrowLeft
                  className="w-5 h-5 mr-2 transform group-hover:-translate-x-2 transition-transform duration-300"
                  aria-hidden="true"
                />
                Back to Home
              </Link>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary tracking-tight flex items-center animate-fade-in">
                
                Top Games
              </h1>
            </div>

            {/* Search */}
            <div className="mb-6 sm:mb-8 md:mb-10">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search top games..."
              />
            </div>

            {/* Subtitle */}
            <div className="mb-6">
              <p className="text-muted-foreground text-center max-w-2xl mx-auto">
                Discover the most popular and highest rated games loved by our
                community. These are the top picks you can’t miss!
              </p>
            </div>

            {/* Content */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredGames.map((game, index) => (
                  <div
                    key={game.id}
                    className="animate-fade-in hover-scale"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Top Games Found"
                description="Try adjusting your search query to find the best rated games."
                icon={
                  <Sparkles className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                }
              />
            )}
          </div>
        </section>
      </main> <br /><br />
    </div>
  );
};

export default TopGames;
