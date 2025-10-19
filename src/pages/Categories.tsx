import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Grid3X3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import SearchInput from "@/components/SearchInput.tsx";
import CategoryFilters from "@/components/CategoryFilters.tsx";
import LoadingSkeleton from "@/components/LoadingSkeleton.tsx";
import EmptyState from "@/components/EmptyState.tsx";
import { fetchGames } from "@/services/gameService";
import type { Game } from "@/services/gameService";

const Categories = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadGames = async () => {
      try {
        const gamesData = await fetchGames();
        setGames(gamesData);
        setFilteredGames(gamesData);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(gamesData.map(game => game.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGames();
  }, []);

  useEffect(() => {
    let filtered = games;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(game => game.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(lowerQuery) ||
          game.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    setFilteredGames(filtered);
  }, [searchQuery, games, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-background">{" "}

      <Navbar />
      
      <main className="flex-grow pt-16">
        <section className="py-10 sm:py-14 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
              <Link
                to="/"
                className="text-cartoon-purple hover:text-cartoon-blue font-semibold flex items-center transition-colors group"
              >
                <ArrowLeft
                  className="w-5 h-5 mr-2 transform group-hover:-translate-x-2 transition-transform duration-300"
                  aria-hidden="true"
                />
                Back to Home
              </Link>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cartoon-purple via-cartoon-pink to-cartoon-orange bg-clip-text text-transparent animate-pulse drop-shadow-lg tracking-tight flex items-center">

                Categories
              </h1>
            </div>

            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search games..."
            />

            <CategoryFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <div className="mb-6">
              <p className="text-muted-foreground text-center max-w-2xl mx-auto">
                Browse games by category to find exactly what you're looking for. 
                From action-packed adventures to relaxing puzzles, we have something for everyone!
              </p>
            </div>
            
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredGames.map((game, index) => (
                  <div
                    key={game.id}
                    className="animate-stagger-fade-in hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </section>
      </main>
      <br /><br />
    </div>
  );
};

export default Categories;