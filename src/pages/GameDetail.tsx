import React, { useEffect, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, AlertCircle, Zap, Star } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

import { fetchGameBySlug, type Game } from "@/services/gameService";

const GameDetail = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Helper to set cookie
  const setCookie = (name: string, value: string, days: number = 1) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    // path=/ ensures the cookie is accessible across the whole site
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
  };

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
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

    // 1. Save Image URL to Cookies
    if (game.image_url) {
      setCookie("downloadGameImage", game.image_url, 1);
    }

    // 2. Fallback to SessionStorage for instant access (optional but safer for redirects)
    sessionStorage.setItem("downloadGameImage", game.image_url || "");

    // 3. Brief delay for animation effect before navigating
    setTimeout(() => {
      navigate(`/Download?game=${encodeURIComponent(game.title)}`);
    }, 800);
  };

  /* ────────────────────── SKELETON LOADER ────────────────────── */
  const BeautifulSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
      <main className="pt-10 pb-12">
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
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); background-size: 200% 100%; animation: shimmer 1.8s infinite; }
      `}</style>
    </div>
  );

  if (loading) return <BeautifulSkeleton />;

  return (
    <>
      <Helmet>
        <title>{game?.title} Mod APK 2025 | WeLoveMods</title>
      </Helmet>

      <main className="min-h-screen bg-[#FDFCF0] pt-12 pb-12 px-4">
        {!game ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <AlertCircle className="w-20 h-20 text-red-500 mb-4" />
            <h1 className="text-4xl font-black">Game Not Found</h1>
            <button onClick={() => navigate("/")} className="mt-6 text-blue-600 font-bold underline">Go Back Home</button>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 font-black text-slate-400 hover:text-pink-500 transition-colors uppercase tracking-widest text-xs">
              <ArrowLeft size={16} /> Back to mods
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="md:col-span-5 lg:col-span-4 space-y-4">
                <div className="bg-white rounded-[2.5rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-b-8 border-slate-200">
                  <img src={game.image_url} alt={game.title} className="w-full aspect-square object-cover rounded-[2rem] mb-4" />
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="relative overflow-hidden w-full bg-[#4ADE80] text-white font-black text-xl py-5 rounded-[2rem] shadow-[0_6px_0_0_#16A34A] flex items-center justify-center gap-3 transition-all active:shadow-none active:translate-y-1"
                  >
                    <Download className={isDownloading ? "animate-bounce" : ""} />
                    {isDownloading ? "PREPARING..." : "GET MOD APK"}
                    <span className="absolute inset-0 bg-white/20 -translate-x-full skew-x-12 shine" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Right Column */}
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="md:col-span-7 lg:col-span-8 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight uppercase italic">
                    {game.title}
                  </h1>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="bg-yellow-400 text-white px-3 py-1 rounded-full flex items-center gap-1 font-black text-sm">
                      <Star size={14} fill="currentColor" /> {game.rating}
                    </div>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold text-sm border border-blue-100">V{game.version}</span>
                    <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-bold text-sm border border-pink-100">{game.downloads.toLocaleString()} USERS</span>
                  </div>
                </div>

                <p className="text-xl text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-200 pl-4">
                  "{game.description}"
                </p>

                <div className="bg-white rounded-[2rem] p-6 shadow-xl border-t-4 border-[#4ADE80]">
                  <h3 className="font-black text-slate-400 text-[10px] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                    <Zap size={12} className="text-[#4ADE80] fill-[#4ADE80]" /> Mod Menu Details
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.features?.map((f, i) => (
                      <div key={i} className="bg-[#F8FAFC] text-slate-700 px-4 py-2 rounded-2xl font-bold text-sm flex items-center gap-2 border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .shine { animation: shineMove 2s infinite; }
        @keyframes shineMove { 0% { transform: translateX(-100%) skewX(-12deg); } 100% { transform: translateX(400%) skewX(-12deg); } }
      `}</style>
    </>
  );
});

export default GameDetail;