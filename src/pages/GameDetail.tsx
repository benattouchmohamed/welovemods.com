import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Box, Folder, Settings } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { fetchGameBySlug, Game } from "@/services/gameService";
import { Card, CardContent } from "@/components/ui/card";
import RatingStars from "@/components/RatingStars";
import { useNavigate } from "react-router-dom";

const GameDetail = () => {
  const { slug } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGame = async () => {
      if (!slug) return;
      try {
        const gameData = await fetchGameBySlug(slug);
        setGame(gameData);
      } catch (error) {
        console.error("Failed to fetch game:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGame();
  }, [slug]);

  const handleDownload = () => {
    if (!game) return;
    setIsDownloading(true);
    setTimeout(() => {
      navigate(`/Download?game=${encodeURIComponent(game.title)}`);
    }, 800);
  };

  const tagColors: Record<string, { base: string; dark: string; text?: string }> = {
    MOD: { base: "bg-green-600", dark: "dark:bg-green-500", text: "text-white" },
    PREMIUM: { base: "bg-purple-600", dark: "dark:bg-purple-500", text: "text-white" },
    NEW: {
      base: "bg-white border border-blue-600 text-blue-600",
      dark: "dark:bg-blue-950 dark:border-blue-500 dark:text-blue-400",
    },
    HOT: { base: "bg-red-600", dark: "dark:bg-red-500", text: "text-white" },
  };

  // === SKELETON LOADING COMPONENT ===
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-cartoon-cream/20 via-white to-cartoon-blue/10 animate-pulse">
      <Navbar />
      <main className="pt-20 pb-6">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Image + Button */}
            <div className="lg:col-span-1">
              <div className="bg-cartoon-cream/50 border-4 border-cartoon-blue/30 rounded-3xl p-4 shadow-lg">
                <div className="bg-gray-300 border-2 border-dashed rounded-2xl w-full h-64 animate-pulse" />
                <div className="mt-6 h-14 bg-gradient-to-r from-cartoon-green/20 to-cartoon-blue/20 rounded-2xl animate-pulse" />
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title Card */}
              <div className="bg-cartoon-cream/50 border-4 border-cartoon-pink/30 rounded-3xl p-6">
                <div className="h-10 bg-gray-300 rounded-full w-3/4 mb-4 animate-pulse" />
                <div className="h-6 bg-gray-300 rounded-full w-1/2 mb-6 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded-full w-full animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded-full w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded-full w-4/6 animate-pulse" />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-yellow-100/50 border-2 border-yellow-300/50 rounded-2xl p-4">
                  <div className="h-12 bg-yellow-200 rounded-xl w-12 animate-pulse" />
                  <div className="mt-2 h-4 bg-gray-300 rounded-full w-20 animate-pulse" />
                  <div className="mt-1 h-6 bg-gray-300 rounded-full w-16 animate-pulse" />
                </div>
                <div className="bg-pink-100/50 border-2 border-pink-300/50 rounded-2xl p-4">
                  <div className="h-12 bg-pink-200 rounded-xl w-12 animate-pulse" />
                  <div className="mt-2 h-4 bg-gray-300 rounded-full w-20 animate-pulse" />
                  <div className="mt-1 h-6 bg-gray-300 rounded-full w-16 animate-pulse" />
                </div>
              </div>

              {/* Features */}
              <div className="bg-cartoon-cream/50 border-4 border-cartoon-green/30 rounded-3xl p-6">
                <div className="h-8 bg-gray-300 rounded-full w-40 mb-4 animate-pulse" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
                      <div className="h-4 bg-gray-300 rounded-full flex-1 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-cartoon-red/20 to-cartoon-pink/20 border-4 border-cartoon-red/30 rounded-3xl p-6 text-center">
                <div className="h-8 bg-gray-300 rounded-full w-48 mx-auto mb-3 animate-pulse" />
                <div className="h-5 bg-gray-300 rounded-full w-64 mx-auto mb-5 animate-pulse" />
                <div className="h-12 bg-white/50 rounded-full w-56 mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        {loading ? (
          <>
            <title>Loading Game... | AppsMod</title>
            <meta name="description" content="Loading game information..." />
          </>
        ) : !game ? (
          <>
            <title>Game Not Found | AppsMod</title>
            <meta name="description" content="Game not found. Browse our mods!" />
          </>
        ) : (
          <>
            <title>{game.title} Mod APK 2025 - Unlimited Coins & Cheats | AppsMod</title>
            <meta
              name="description"
              content={`Download ${game.title} Mod APK 2025 with unlimited coins, unlocked features. Safe & free at welovemods.com.`}
            />
            <meta
              name="keywords"
              content={`${game.title} mod, cheats 2025, unlimited coins, Android mods, AppsMod, welovemods.com`}
            />
            <meta property="og:title" content={`${game.title} Mod APK 2025`} />
            <meta property="og:image" content={game.image_url} />
            <meta name="twitter:card" content="summary_large_image" />
            <link rel="canonical" href={`https://welovemods.com/game/${slug}`} />
          </>
        )}
      </Helmet>

      <Navbar />

      {/* === SHOW SKELETON WHILE LOADING === */}
      {loading ? (
        <LoadingSkeleton />
      ) : !game ? (
        /* === NOT FOUND === */
        <main className="pt-20 pb-6">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-black text-cartoon-red mb-6">Game Not Found!</h1>
            <Button
              className="bg-cartoon-blue hover:bg-cartoon-blue/90 text-white font-black shadow-base rounded-full px-8 py-6 text-lg flex items-center mx-auto"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-6 h-6 mr-3" />
              Back to Games
            </Button>
          </div>
        </main>
      ) : (
        /* === GAME LOADED === */
        <main className="pt-20 pb-6">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Image & Download */}
              <div className="lg:col-span-1">
                <div className="bg-cartoon-cream border-4 border-cartoon-blue rounded-3xl p-4 shadow-blue">
                  <img
                    src={game.image_url || "/placeholder.svg"}
                    alt={game.title}
                    className="w-full aspect-square object-cover rounded-2xl shadow-soft"
                  />
                  <button
                    className="w-full mt-6 bg-gradient-to-r from-cartoon-green to-cartoon-blue text-white font-black text-lg py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 flex items-center justify-center gap-2"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-6 h-6" />
                        DOWNLOAD NOW!
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right: Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-cartoon-cream border-4 border-cartoon-pink rounded-3xl p-6 shadow-pink">
                  <h1 className="text-3xl lg:text-4xl font-black text-cartoon-red mb-4 leading-tight">
                    {game.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <RatingStars rating={game.rating} />
                    <span className="text-xl font-black text-cartoon-blue">{game.rating}/5</span>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">{game.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-yellow-200 border-2 border-yellow-400 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-400 p-3 rounded-xl">
                        <Download className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-yellow-700">Downloads</div>
                        <div className="text-xl font-black text-gray-800">
                          {game.downloads.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-pink-200 border-2 border-pink-400 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-400 p-3 rounded-xl">
                        <Box className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-pink-700">Version</div>
                        <div className="text-xl font-black text-gray-800">{game.version}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {game.features && game.features.length > 0 && (
                  <div className="bg-cartoon-cream border-4 border-cartoon-green rounded-3xl p-6 shadow-green">
                    <h3 className="text-2xl font-black text-cartoon-green mb-4">MOD Features</h3>
                    <ul className="space-y-3">
                      {game.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700">
                          <div className="w-3 h-3 bg-cartoon-green rounded-full animate-pulse"></div>
                          <span className="font-medium text-lg">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-gradient-to-r from-cartoon-red to-cartoon-pink border-4 border-cartoon-red rounded-3xl p-6 shadow-red text-center">
                  <h3 className="text-2xl font-black text-white mb-2">Ready to Play?</h3>
                  <p className="text-white/90 font-bold mb-4">
                    Join thousands of players enjoying this amazing game!
                  </p>
                  <button
                    className="bg-white text-cartoon-red font-black px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-lg"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    {isDownloading ? "Preparing..." : "Download & Install Now!"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main> 
      )}<br /> <br />
    </div>
  );
};

export default GameDetail;