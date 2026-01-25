import React, { useEffect, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, AlertCircle, Zap, Star, ShieldCheck, Lock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";

import { fetchGameBySlug, type Game } from "@/services/gameService";

/* ──────────────────────────────────────────────────────────────
   PRO SKELETON - matched DownloadPage style
   ────────────────────────────────────────────────────────────── */
const BeautifulSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FFFBEB] px-4 py-6 space-y-6">
      <div className="max-w-5xl mx-auto">
        {/* Back button placeholder */}
        <div className="mb-6 w-40 h-8 bg-white/80 rounded-full animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left - Image + button */}
          <div className="md:col-span-5 lg:col-span-4 space-y-5">
            <div className="rounded-[2.5rem] bg-white border-2 border-slate-100 shadow-2xl p-5 animate-pulse">
              <div className="aspect-square rounded-[2rem] bg-slate-200/80" />
              <div className="h-14 mt-5 bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl" />
            </div>
            <div className="h-20 rounded-[2rem] bg-white/80 border-2 border-amber-100 shadow-xl animate-pulse" />
          </div>

          {/* Right - Title + content */}
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            <div className="h-20 bg-white/80 rounded-[2.5rem] animate-pulse" />
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-amber-100/60 rounded-full animate-pulse" />
              <div className="h-10 w-40 bg-slate-100/60 rounded-full animate-pulse" />
            </div>
            <div className="h-32 bg-white/80 rounded-[2rem] animate-pulse" />
            <div className="h-72 bg-white rounded-[2.5rem] border-2 border-amber-100 shadow-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   MAIN GAME DETAIL PAGE - matched DownloadPage aesthetic
   ────────────────────────────────────────────────────────────── */
const GameDetail = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadGame = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await fetchGameBySlug(slug);
        setGame(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    loadGame();
  }, [slug]);

  const handleDownload = () => {
    if (!game || isDownloading) return;
    setIsDownloading(true);
    sessionStorage.setItem("downloadGameImage", game.image_url || "");
    setTimeout(() => {
      navigate(`/Download?game=${encodeURIComponent(game.title)}`);
    }, 1400);
  };

  return (
    <>
      <Helmet>
        <title>{game ? `${game.title} Mod APK 2026` : "Loading..."} | WeLoveMods</title>
      </Helmet>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BeautifulSkeleton />
          </motion.div>
        ) : !game ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#FFFBEB] flex flex-col items-center justify-center px-4 text-center"
          >
            <AlertCircle className="w-20 h-20 text-amber-500 mb-6" />
            <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Mod Not Found</h1>
            <button
              onClick={() => navigate("/")}
              className="mt-8 px-12 py-5 bg-blue-600 text-white font-black text-lg uppercase tracking-widest rounded-2xl shadow-xl hover:bg-blue-700 active:translate-y-1 transition-all"
            >
              Back to Home
            </button>
          </motion.div>
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#FFFBEB] pb-12 px-4 pt-6 font-sans overflow-x-hidden"
          >
            <div className="w-full max-w-5xl mx-auto space-y-8">
              {/* Back Button - matched ticker style */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-amber-600 font-black uppercase tracking-[0.25em] text-xs"
              >
                <ArrowLeft size={16} strokeWidth={3} /> Back to mods
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* LEFT COLUMN - Image + Actions */}
                <div className="md:col-span-5 lg:col-span-4 space-y-5">
                  {/* Game Card - big rounded, verified badge */}
                  <div className="rounded-[2.5rem] p-5 bg-white border-2 border-slate-100 shadow-2xl relative overflow-hidden">
                    <div className="relative">
                      <img
                        src={game.image_url}
                        alt={game.title}
                        className="w-full aspect-square object-cover rounded-[2rem] border-4 border-[#FFFBEB] shadow-xl"
                      />
                      <div className="absolute -bottom-3 -right-3 bg-emerald-500 p-2 rounded-full border-4 border-white shadow-lg">
                        <ShieldCheck size={20} className="text-white" strokeWidth={3} />
                      </div>
                    </div>

                    {/* Download Button - matched DownloadPage style */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className={`
                        mt-6 w-full flex items-center justify-center gap-3
                        bg-green-600 active:bg-green-800 text-white
                        font-black text-xl uppercase tracking-widest
                        rounded-2xl py-6 shadow-lg shadow-blue-500/30
                        active:translate-y-1 transition-all relative overflow-hidden
                      `}
                    >
                      <Download size={24} className={isDownloading ? "animate-bounce" : ""} />
                      {isDownloading ? "PREPARING..." : "DOWNLOAD NOW"}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine" />
                    </motion.button>
                  </div>

                  {/* Mini stats bar - rating + version */}
                  <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_#000] p-5 flex justify-around items-center">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Rating</p>
                      <div className="flex items-center gap-1.5 justify-center mt-1">
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                        <span className="font-black text-slate-800 text-lg">{game.rating}</span>
                      </div>
                    </div>
                    <div className="h-10 w-px bg-slate-200" />
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Version</p>
                      <p className="font-black text-slate-800 text-lg mt-1">v{game.version}</p>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN - Title + Description + Features */}
                <div className="md:col-span-7 lg:col-span-8 space-y-6">
                  {/* Title + tags */}
                  <div className="space-y-4">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-none uppercase italic tracking-tighter">
                      {game.title}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-black text-xs border border-amber-200 uppercase tracking-wider">
                        Premium Mod
                      </span>
                      <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full font-black text-xs border border-slate-200 uppercase tracking-wider">
                        {game.downloads.toLocaleString()} Users
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-xs font-black uppercase">
                        <Lock size={12} /> Syncing
                      </span>
                    </div>
                  </div>

                  {/* Quote-like description */}
                  <div className="bg-white rounded-[2rem] p-6 border-2 border-amber-400/40 shadow-xl">
                    <p className="text-lg text-slate-700 font-bold leading-relaxed italic">
                      "{game.description}"
                    </p>
                  </div>

                  {/* Features section - matched offer card style */}
                  {game.features && game.features.length > 0 && (
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl border-2 border-blue-500/20 relative overflow-hidden">
                      <div className="absolute inset-0 border-2 border-blue-500/30 animate-pulse pointer-events-none rounded-[2.5rem]" />
                      <h3 className="font-black text-amber-600 uppercase tracking-[0.3em] text-sm mb-5 flex items-center gap-2">
                        <Zap size={16} className="fill-amber-500 text-amber-500" /> Mod Features Unlocked
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {game.features.map((feature, i) => (
                          <div
                            key={i}
                            className="bg-slate-50 px-5 py-4 rounded-2xl border border-slate-200 font-bold text-slate-700 flex items-center gap-3 text-sm"
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Global shine animation */}
            <style>{`
              @keyframes shine {
                0%   { transform: translateX(-100%) skewX(-20deg); }
                100% { transform: translateX(300%) skewX(-20deg); }
              }
              .animate-shine {
                animation: shine 3s infinite;
              }
            `}</style>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
});

export default GameDetail;