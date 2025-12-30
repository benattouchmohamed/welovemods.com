import React, { useEffect, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Box, AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

import { fetchGameBySlug, type Game } from "@/services/gameService";
import RatingStars from "@/components/RatingStars";

const GameDetail = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const loadGame = async () => {
      try {
        const data = await fetchGameBySlug(slug);
        setGame(data);
      } catch (err) {
        console.error("Failed to fetch game:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [slug]);

  const handleDownload = async () => {
    if (!game || isDownloading) return;

    setIsDownloading(true);

    let imgDataUrl = game.image_url || "";
    if (game.image_url) {
      try {
        const resp = await fetch(game.image_url, { mode: "cors" });
        if (resp.ok) {
          const blob = await resp.blob();
          imgDataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        }
      } catch (e) {
        console.warn("Image to base64 failed, using direct URL");
      }
    }

    sessionStorage.setItem("downloadGameImage", imgDataUrl);

    setTimeout(() => {
      navigate(`/Download?game=${encodeURIComponent(game.title)}`);
    }, 400);
  };
  /* ────────────────────── SKELETON LOADER (Your Original Beautiful One) ────────────────────── */
  const BeautifulSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-xl border-4 border-blue-200/50 animate-pulse">
                <div className="bg-gradient-to-br from-blue-200 to-purple-200 border-2 border-dashed rounded-2xl w-full h-64 shimmer" />
                <div className="mt-6 h-14 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl shimmer" />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-4 border-pink-200/50 animate-pulse">
                <div className="h-10 bg-gradient-to-r from-red-300 to-pink-300 rounded-lg w-3/4 mb-3 shimmer" />
                <div className="h-7 bg-gradient-to-r from-purple-300 to-blue-300 rounded-lg w-1/2 mb-4 shimmer" />
                <div className="space-y-2">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer" />
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6 shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 1.8s infinite;
        }
      `}</style>
    </div>
  
  );

  return (
    <>
      <Helmet>
        {loading ? (
          <>
            <title>Loading... | WeLoveMods</title>
            <meta name="description" content="Loading game details..." />
          </>
        ) : !game ? (
          <>
            <title>Game Not Found | WeLoveMods</title>
            <meta name="description" content="The requested modded game could not be found." />
          </>
        ) : (
          <>
            <title>{game.title} Mod APK 2025 - Unlimited Coins & Gems | WeLoveMods</title>
            <meta
              name="description"
              content={`Download ${game.title} Mod APK latest version with unlimited money, gems, unlocked features, and more. Safe & free – updated 2025!`}
            />
            <meta name="keywords" content={`${game.title} mod apk, ${game.title} hack, unlimited coins, mod menu, 2025`} />
            <meta property="og:title" content={`${game.title} Mod APK 2025 - Unlimited Everything`} />
            <meta property="og:description" content={`Free download ${game.title} mod with all features unlocked.`} />
            <meta property="og:image" content={game.image_url || ""} />
            <meta property="og:url" content={`https://welovemods.com/game/${slug}`} />
            <link rel="canonical" href={`https://welovemods.com/game/${slug}`} />
          </>
        )}
      </Helmet>

      {/* Navbar is ALWAYS present */}
     

      {/* Loading State */}
      {loading && <BeautifulSkeleton />}

      {/* Not Found State */}
      {!loading && !game && (
        <main className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 px-4 text-center">
          <AlertCircle className="w-24 h-24 text-red-500 mb-8" />
          <h1 className="text-5xl font-black text-red-600 mb-6">Game Not Found!</h1>
          <p className="text-xl text-gray-700 mb-10 max-w-md">
            Sorry, we couldn't find this modded game.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-10 py-6 rounded-full flex items-center gap-3 shadow-xl transition transform hover:scale-105"
          >
            <ArrowLeft className="w-7 h-7" />
            Back to Games
          </button>
        </main>
      )}

      {/* Success State - Game Found */}
      {!loading && game && (
        <main className="pt-20 pb-12 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="mb-8 flex items-center gap-2 text-blue-700 font-bold hover:text-blue-900 transition"
            >
              <ArrowLeft className="w-6 h-6" />
              Back 
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Image + Download Button */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-blue-200">
                  <div className="relative overflow-hidden rounded-2xl mb-6 group">
                    <img
                      src={game.image_url || "/placeholder.svg"}
                      alt={`${game.title} Mod APK`}
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="
                      relative overflow-hidden w-full
                      bg-gradient-to-r from-green-500 to-blue-600
                      hover:from-green-600 hover:to-blue-700
                      text-white font-black text-xl py-5 rounded-2xl
                      flex items-center justify-center gap-3
                      shadow-xl hover:shadow-2xl
                      transform hover:scale-105 active:scale-95
                      transition-all duration-300
                      disabled:opacity-70 disabled:cursor-not-allowed
                    "
                  >
                    <span className="absolute inset-0 bg-white/30 -translate-x-full skew-x-12 shine" />
                    <Download className="w-8 h-8" />
                    {isDownloading ? "Preparing..." : "DOWNLOAD NOW!"}
                  </button>
                </div>
              </div>

              {/* Right: Game Details */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-pink-200">
                  <h1 className="text-4xl lg:text-5xl font-black text-red-600 mb-4">
                    {game.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-6">
                    <RatingStars rating={game.rating} />
                    <span className="text-2xl font-bold text-blue-600">{game.rating}/5</span>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">{game.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-yellow-100 rounded-2xl p-6 border-4 border-yellow-400 shadow-lg text-center">
                    <Download className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                    <p className="text-yellow-800 font-bold">Downloads</p>
                    <p className="text-3xl font-black text-yellow-900">
                      {game.downloads.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-pink-100 rounded-2xl p-6 border-4 border-pink-400 shadow-lg text-center">
                    <Box className="w-12 h-12 text-pink-600 mx-auto mb-3" />
                    <p className="text-pink-800 font-bold">Version</p>
                    <p className="text-3xl font-black text-pink-900">v{game.version}</p>
                  </div>
                </div>

                {/* MOD Features */}
                {game.features && game.features.length > 0 && (
                  <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-green-200">
                    <h3 className="text-3xl font-black text-green-600 mb-6">MOD Features</h3>
                    <ul className="space-y-4">
                      {game.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-4 text-gray-800">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0" />
                          <span className="text-lg font-semibold">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Final CTA */}
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl p-8 text-center shadow-2xl border-4 border-red-300">
                  <h3 className="text-3xl font-black text-white mb-3">Ready to Play?</h3>
                  <p className="text-xl text-white/90 mb-6">Join millions of happy players!</p>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-white text-red-600 font-black text-2xl px-12 py-5 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-70"
                  >
                    {isDownloading ? "Preparing..." : "Download & Install Now!"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Shine animation */}
      <style jsx>{`
        .shine {
          animation: shineMove 2s infinite;
        }
        @keyframes shineMove {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(300%) skewX(-12deg); }
        }
      `}</style>
    </>
  );
});

GameDetail.displayName = "GameDetail";

export default GameDetail;