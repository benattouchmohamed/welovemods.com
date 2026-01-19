import React, { useEffect, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, AlertCircle, Zap, Star, ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

import { fetchGameBySlug, type Game } from "@/services/gameService";

const GameDetail = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const setCookie = (name: string, value: string, days: number = 1) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
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
    if (game.image_url) setCookie("downloadGameImage", game.image_url, 1);
    sessionStorage.setItem("downloadGameImage", game.image_url || "");

    setTimeout(() => {
      navigate(`/Download?game=${encodeURIComponent(game.title)}`);
    }, 1000);
  };

  /* ────────────────────── BEAUTIFUL CREAM SKELETON ────────────────────── */
  const BeautifulSkeleton = () => (
    <div className="min-h-screen bg-[#FFFBEB] pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-amber-50">
              <div className="aspect-square bg-amber-50/50 rounded-[2rem] shimmer mb-4" />
              <div className="h-16 bg-amber-50/50 rounded-[1.8rem] shimmer" />
            </div>
          </div>
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            <div className="h-12 bg-amber-50/30 rounded-2xl w-3/4 shimmer" />
            <div className="h-6 bg-amber-50/20 rounded-full w-1/2 shimmer" />
            <div className="h-32 bg-white rounded-[2rem] shimmer border border-amber-50" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <BeautifulSkeleton />;

  return (
    <>
      <Helmet>
        <title>{game?.title} Mod APK 2026 | WeLoveMods</title>
      </Helmet>

      {/* CHANGED BG TO CREAM (#FFFBEB) */}
      <main className="min-h-screen bg-[#FFFBEB] pt-6 pb-12 px-4">
        {!game ? (
          <div className="flex flex-col items-center justify-start pt-20 h-[80vh] text-center">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
              <AlertCircle className="w-16 h-16 text-amber-400 mb-4 mx-auto" />
            </motion.div>
            <h1 className="text-2xl font-black text-slate-800">Mod not found</h1>
            <button 
              onClick={() => navigate("/")} 
              className="mt-4 px-10 py-3 bg-amber-500 text-white rounded-full font-black shadow-lg shadow-amber-200 active:scale-95 transition-all"
            >
              GO BACK HOME
            </button>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 font-black text-slate-400 hover:text-amber-600 transition-colors uppercase tracking-[0.2em] text-[10px]">
              <ArrowLeft size={14} strokeWidth={3} /> Back to mods
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="md:col-span-5 lg:col-span-4 space-y-4">
                <div className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-amber-900/5 border border-white">
                  <div className="relative mb-4">
                    <img src={game.image_url} alt={game.title} className="w-full aspect-square object-cover rounded-[2rem]" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white flex items-center gap-1.5 shadow-sm">
                       <ShieldCheck size={14} className="text-emerald-500" />
                       <span className="text-[10px] font-black text-slate-700 uppercase">Verified</span>
                    </div>
                  </div>
                  
                  <motion.button 
                    whileTap={{ scale: 0.96 }}
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="relative overflow-hidden w-full bg-[#4ADE80] text-white font-black text-xl py-5 rounded-[2rem] shadow-[0_6px_0_0_#16A34A] flex items-center justify-center gap-3 transition-all active:shadow-none active:translate-y-1"
                  >
                    <Download className={isDownloading ? "animate-bounce" : ""} />
                    {isDownloading ? "PREPARING..." : "Download"}
                    <span className="absolute inset-0 bg-white/20 -translate-x-full skew-x-12 shine" />
                  </motion.button>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-amber-50 flex justify-around items-center shadow-sm">
                   <div className="text-center">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Rating</p>
                      <p className="font-bold text-slate-700 flex items-center gap-1 justify-center"><Star size={14} className="fill-amber-400 text-amber-400" /> {game.rating}</p>
                   </div>
                   <div className="h-8 w-px bg-amber-50" />
                   <div className="text-center">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Version</p>
                      <p className="font-bold text-slate-700">v{game.version}</p>
                   </div>
                </div>
              </motion.div>

              {/* Right Column */}
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="md:col-span-7 lg:col-span-8 space-y-6">
                <div className="space-y-4 text-center md:text-left">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase italic">
                    {game.title}
                  </h1>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full font-black text-[10px] border border-amber-100 uppercase tracking-wider">Clean APK</span>
                    <span className="bg-pink-50 text-pink-600 px-4 py-1.5 rounded-full font-black text-[10px] border border-pink-100 uppercase tracking-wider">{game.downloads.toLocaleString()} Users</span>
                  </div>
                </div>

                <p className="text-lg text-slate-500 font-medium leading-relaxed italic border-l-4 border-amber-200 pl-6">
                  "{game.description}"
                </p>

                {/* Conditional Rendering for Mod Menu Details */}
                {game.features && game.features.length > 0 && (
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-amber-900/5 border-t-8 border-amber-400">
                    <h3 className="font-black text-amber-500 text-[11px] tracking-[0.3em] uppercase mb-6 flex items-center gap-2">
                      <Zap size={14} className="fill-amber-500" /> Mod Menu Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {game.features.map((f, i) => (
                        <div key={i} className="bg-amber-50/30 text-slate-700 px-5 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 border border-amber-50">
                          <div className="w-2 h-2 rounded-full bg-amber-400" /> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .shimmer {
          background: linear-gradient(90deg, transparent 25%, rgba(255, 255, 255, 0.8) 50%, transparent 75%);
          background-size: 200% 100%;
          animation: shimmerAnim 1.5s infinite linear;
        }
        @keyframes shimmerAnim { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shine { animation: shineMove 3s infinite; }
        @keyframes shineMove { 0% { transform: translateX(-100%) skewX(-12deg); } 100% { transform: translateX(600%) skewX(-12deg); } }
      `}</style>
    </>
  );
});

export default GameDetail;