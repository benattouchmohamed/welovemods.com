import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Box, Folder, Settings } from "lucide-react";
import { Helmet } from "react-helmet-async"; // Import Helmet
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

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleDownload = () => {
  if (!game) return;
  setIsDownloading(true);

  // ⏳ يمكن إضافة تأخير بسيط لإظهار أن التحميل جارٍ
  setTimeout(() => {
    // الانتقال إلى صفحة التحميل مع اسم اللعبة في query
    navigate(`/Download?game=${encodeURIComponent(game.title)}`);
  }, 800);
};

  // 🎨 Logic colors for tags
  const tagColors: Record<string, { base: string; dark: string; text?: string }> = {
    MOD: { base: "bg-green-600", dark: "dark:bg-green-500", text: "text-white" },
    PREMIUM: { base: "bg-purple-600", dark: "dark:bg-purple-500", text: "text-white" },
    NEW: {
      base: "bg-white border border-blue-600 text-blue-600",
      dark: "dark:bg-blue-950 dark:border-blue-500 dark:text-blue-400",
    },
    HOT: { base: "bg-red-600", dark: "dark:bg-red-500", text: "text-white" },
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        {loading ? (
          <>
            <title>Loading Game... | AppsMod</title>
            <meta
              name="description"
              content="Loading game information from AppsMod - Your source for premium Android game mods and APKs at welovemods.com."
            />
            <meta
              name="keywords"
              content="Android game mods, mod APK 2025, AppsMod, welovemods.com"
            />
          </>
        ) : !game ? (
          <>
            <title>Game Not Found | AppsMod</title>
            <meta
              name="description"
              content="The requested game could not be found. Browse our collection of premium Android game mods and APKs at welovemods.com."
            />
            <meta
              name="keywords"
              content="Android game mods, mod APK 2025, AppsMod, welovemods.com"
            />
          </>
        ) : (
          <>
            <title>{game.title} Mod APK 2025 - Unlimited Coins & Latest Cheats | AppsMod</title>
            <meta
              name="description"
              content={`Download ${game.title} Mod APK 2025 with unlimited coins, unlocked features, and latest cheats. Safe Android game mod available for free at welovemods.com.`}
            />
            <meta
              name="keywords"
              content={`${game.title} mod APK, ${game.title} cheats 2025, unlimited coins APK, Android game mods, free mods, AppsMod, welovemods.com, HappyMod, APKdone, ModDroid, APKPure, game hacks, modded games`}
            />
            <meta name="author" content="AppsMod Team" />
            <meta name="robots" content="index, follow" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://welovemods.com/game/${slug}`} />
            <meta property="og:title" content={`${game.title} Mod APK 2025 - Unlimited Coins & Latest Cheats | AppsMod`} />
            <meta
              property="og:description"
              content={`Download ${game.title} Mod APK 2025 with unlimited coins, unlocked features, and latest cheats. Safe Android game mod available for free at welovemods.com.`}
            />
            <meta property="og:image" content={game.image_url || "https://welovemods.com/images/og-image.jpg"} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={`https://welovemods.com/game/${slug}`} />
            <meta property="twitter:title" content={`${game.title} Mod APK 2025 - Unlimited Coins & Latest Cheats | AppsMod`} />
            <meta
              property="twitter:description"
              content={`Download ${game.title} Mod APK 2025 with unlimited coins, unlocked features, and latest cheats. Safe Android game mod available for free at welovemods.com.`}
            />
            <meta property="twitter:image" content={game.image_url || "https://welovemods.com/images/og-image.jpg"} />
            <link rel="canonical" href={`https://welovemods.com/game/${slug}`} />
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": game.title,
                "description": game.description,
                "image": game.image_url || "https://welovemods.com/images/og-image.jpg",
                "operatingSystem": "Android",
                "applicationCategory": "GameApplication",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": game.rating || 4.5,
                  "ratingCount": Math.floor((game.downloads || 1000) / 10),
                  "bestRating": "5",
                  "worstRating": "1",
                },
              })}
            </script>
          </>
        )}
      </Helmet>
      <Navbar />
      <main className="pt-20 pb-6">
        <div className="container mx-auto px-4 max-w-4xl">
          {loading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <div className="w-16 h-16 border-4 border-cartoon-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !game ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <h1 className="text-4xl font-black text-cartoon-red">Game Not Found!</h1>
              <Button
                className="bg-cartoon-blue hover:bg-cartoon-blue/90 text-white font-black shadow-base rounded-full px-6 py-3 flex items-center"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Games
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Game Image & Download */}
              <div className="lg:col-span-1">
                <div className="bg-cartoon-cream border-4 border-cartoon-blue rounded-3xl p-4 shadow-blue">
                  <div className="relative">
                    <img
                      src={game.image_url || "/placeholder.svg"}
                      alt={game.title}
                      className="w-full aspect-square object-cover rounded-2xl shadow-soft"
                    />
                  </div>
                  {/* Mega Download Button */}
                  <button
                    className="w-full mt-6 bg-gradient-to-r from-cartoon-green to-cartoon-blue text-white font-black text-lg py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-pulse"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      "Downloading..."
                    ) : (
                      <>
                        <Download className="inline w-6 h-6 mr-2" />
                        DOWNLOAD NOW!
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right: Game Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title & Rating Card */}
                <div className="bg-cartoon-cream border-4 border-cartoon-pink rounded-3xl p-6 shadow-pink">
                  <h1 className="text-3xl lg:text-4xl font-black text-cartoon-red mb-4 leading-tight">
                    {game.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <RatingStars rating={game.rating} />
                    <span className="text-xl font-black text-cartoon-blue">
                      {game.rating}/5
                    </span>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {game.description}
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Downloads Card */}
                  <div className="bg-yellow-200 border-2 border-yellow-400 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-400 p-3 rounded-xl flex items-center justify-center">
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

                  {/* Version Card */}
                  <div className="bg-pink-200 border-2 border-pink-400 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-400 p-3 rounded-xl flex items-center justify-center">
                        <Box className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-pink-700">Version</div>
                        <div className="text-xl font-black text-gray-800">
                          {game.version}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {game.features && game.features.length > 0 && (
                  <div className="bg-cartoon-cream border-4 border-cartoon-green rounded-3xl p-6 shadow-green">
                    <h3 className="text-2xl font-black text-cartoon-green mb-4 flex items-center">
                      MOD Features
                    </h3>
                    <ul className="space-y-3">
                      {game.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-700">
                          <div className="w-3 h-3 bg-cartoon-green rounded-full flex-shrink-0 animate-pulse"></div>
                          <span className="font-medium text-lg">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-cartoon-red to-cartoon-pink border-4 border-cartoon-red rounded-3xl p-6 shadow-red text-center">
                  <h3 className="text-2xl font-black text-white mb-2">
                    Ready to Play?
                  </h3>
                  <p className="text-white/90 font-bold mb-4">
                    Join thousands of players enjoying this amazing game!
                  </p>
                  <button
                    className="bg-white text-cartoon-red font-black px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-lg"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    Download & Install Now!
                  </button>
                </div>
                <br /> <br />
              </div>
            </div>
          )}
        </div>
      </main>
   
    </div>
  );
};

export default GameDetail;