import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GameCard from "@/components/GameCard";
import { fetchGames } from "@/services/gameService";
import type { Game } from "@/services/gameService";
import { useIsMobile } from "@/hooks/use-mobile";

const AllGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
    const filtered = games.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [searchQuery, games]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-pink-50 to-white dark:from-gray-900 dark:via-pink-950 dark:to-gray-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        body, html {
          font-family: 'Poppins', sans-serif;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
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
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-stagger-fade-in {
          animation: staggerFadeIn 0.5s ease-out forwards;
        }
        .animate-stagger-fade-in:nth-child(2n) { animation-delay: 0.1s; }
        .animate-stagger-fade-in:nth-child(3n) { animation-delay: 0.2s; }
        .animate-stagger-fade-in:nth-child(4n) { animation-delay: 0.3s; }
        .hover\\:scale-up {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover\\:scale-up:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(255, 105, 180, 0.3);
        }
        .gradient-border {
          border: 2px solid transparent;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(90deg, #ff69b4, #ff1493) border-box;
          border-radius: 12px;
        }
        .dark .gradient-border {
          background: linear-gradient(#2d1b2c, #2d1b2c) padding-box,
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
          box-shadow: inset 0 0 15px rgba(255, 105, 180, 0.3);
        }
        .dark .shimmer {
          background: linear-gradient(
            90deg,
            #2d1b2c 25%,
            #ff1493 50%,
            #2d1b2c 75%
          );
          box-shadow: inset 0 0 15px rgba(255, 21, 147, 0.3);
        }
        h2, a, .text-2xl, .text-3xl, .text-4xl {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
        }
        p, div {
          font-family: 'Poppins', sans-serif;
          font-weight: 400;
        }
        .search-input {
          transition: all 0.3s ease;
        }
        .search-input:focus {
          box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.3);
          border-color: #ff69b4;
        }
      `}</style>

      <Navbar />

      <main className="flex-grow pt-16">
        <section className="py-10 sm:py-14 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-rose-500 to-red-600 bg-clip-text text-transparent animate-pulse drop-shadow-lg tracking-tight">
                All Modded Games
              </h2>
              <Link
                to="/"
                className="text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 font-semibold flex items-center transition-colors group animate-pulse"
                style={{ animationDelay: "0.2s" }}
              >
                <ArrowLeft
                  className="w-5 h-5 mr-2 transform group-hover:-translate-x-2 transition-transform duration-300"
                  aria-hidden="true"
                />
                Back to Home
                <span className="block h-0.5 w-0 bg-pink-500 dark:bg-pink-400 group-hover:w-12 transition-all duration-400"></span>
              </Link>
            </div>

            <div className="mb-6 sm:mb-8">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full max-w-md p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 search-input gradient-border focus:outline-none"
              />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(isMobile ? 2 : 8)].map((_, index) => (
                  <div
                    key={index}
                    className="animate-stagger-fade-in gradient-border rounded-xl shadow-md p-4 overflow-hidden"
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredGames.length > 0 ? (
                  filteredGames.map((game, index) => (
                    <div
                      key={game.id}
                      className="animate-stagger-fade-in hover:scale-up gradient-border"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <GameCard game={game} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                    No games found matching your search.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <br /><br />
      <Footer />
    </div>
  );
};

export default AllGames;
