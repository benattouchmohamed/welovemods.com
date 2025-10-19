import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import { fetchGames } from "@/services/gameService";
import type { Game } from "@/services/gameService";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadGames = async () => {
      try {
        const gamesData = await fetchGames();
        setGames(gamesData);
        setFilteredGames(gamesData);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-pink-50 to-white dark:from-gray-900 dark:via-pink-950 dark:to-gray-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        body, html {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
          overscroll-behavior: none;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes staggerFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-stagger-fade-in {
          animation: staggerFadeIn 0.4s ease-out forwards;
        }
        .animate-stagger-fade-in:nth-child(2n) { animation-delay: 0.1s; }
        .animate-stagger-fade-in:nth-child(3n) { animation-delay: 0.2s; }
        .animate-stagger-fade-in:nth-child(4n) { animation-delay: 0.3s; }
        .hover\\:scale-up {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover\\:scale-up:hover {
          transform: scale(1.03);
          box-shadow: 0 8px 16px rgba(255, 105, 180, 0.2);
        }
        .gradient-border {
          border: 2px solid transparent;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(90deg, #ff69b4, #ff1493) border-box;
          border-radius: 12px;
        }
        .dark .gradient-border {
          background: linear-gradient(#1f1f1f, #1f1f1f) padding-box,
                      linear-gradient(90deg, #ff1493, #ff69b4) border-box;
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            #ffe4f1 25%,
            #ff69b4 50%,
            #ffe4f1 75%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
          box-shadow: inset 0 0 12px rgba(255, 105, 180, 0.2);
        }
        .dark .shimmer {
          background: linear-gradient(
            90deg,
            #2d1b2c 25%,
            #ff1493 50%,
            #2d1b2c 75%
          );
          box-shadow: inset 0 0 12px rgba(255, 21, 147, 0.2);
        }
        h2, a, .text-2xl, .text-3xl, .text-4xl {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
        }
        p, div, input {
          font-family: 'Poppins', sans-serif;
          font-weight: 400;
        }
        .search-container {
          position: relative;
          max-width: 500px;
          width: 100%;
          margin: 0 auto 1.5rem;
        }
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 400;
          transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .dark .search-input {
          background-color: #2d3748;
          border-color: #4b5563;
          color: white;
        }
        .search-input:focus {
          outline: none;
          border-color: #ff69b4;
          box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.15);
        }
        .search-input::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }
        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
          width: 1.25rem;
          height: 1.25rem;
        }
        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: background-color 0.2s, color 0.2s;
        }
        .view-all-link:hover {
          background-color: rgba(34, 197, 94, 0.1);
        }
        .dark .view-all-link:hover {
          background-color: rgba(52, 211, 153, 0.1);
        }
        @media (max-width: 640px) {
          .search-container {
            margin: 0 auto 1rem;
          }
          .search-input {
            font-size: 0.9rem;
            padding: 0.6rem 0.8rem 0.6rem 2.2rem;
          }
          .search-icon {
            width: 1.1rem;
            height: 1.1rem;
            left: 0.6rem;
          }
          h2 {
            font-size: 1.5rem;
          }
          .view-all-link {
            font-size: 0.9rem;
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>

      <Navbar />

      <main className="flex-grow pt-16">
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="search-container animate-fade-in-up">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search games by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 bg-clip-text text-transparent animate-pulse drop-shadow-md tracking-tight"
              >
                Top Modded Games
              </h2>
              <Link
                to="/all-games"
                className="text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 view-all-link group animate-pulse"
                style={{ animationDelay: "0.2s" }}
              >
                View all
                <ArrowRight
                  className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                  aria-hidden="true"
                />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(isMobile ? 2 : 8)].map((_, index) => (
                  <div
                    key={index}
                    className="animate-stagger-fade-in gradient-border rounded-xl shadow-sm p-4 overflow-hidden"
                  >
                    <div className="aspect-[3/2] shimmer rounded-lg mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 shimmer rounded w-3/4"></div>
                      <div className="h-3 shimmer rounded w-1/2"></div>
                      <div className="h-8 shimmer rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredGames.map((game, index) => (
                  <div
                    key={game.id}
                    className="animate-stagger-fade-in hover:scale-up gradient-border rounded-xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <br /><br />
    </div>
  );
};

export default Index;