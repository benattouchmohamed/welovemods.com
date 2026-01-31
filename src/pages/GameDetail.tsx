import React, { useEffect, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  AlertCircle,
  Zap,
  Star,
  ShieldCheck,
  Lock,
  Share2,
  BookOpen,
} from "lucide-react";
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

// Keep generating the URL the same way:
const blogUrl = `/blog/how-to-download-${slug}-on-mobile-for-free`;
  const shareUrl = `${window.location.origin}${blogUrl}`;

  const handleShare = async () => {
    const shareData = {
      title: `${game?.title} Mod APK 2026 – Unlimited Everything!`,
      text: game?.description || "Check out this epic mod – free download guide inside!",
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
      alert("Couldn't share – copy the link manually.");
    }
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
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-amber-600 font-black uppercase tracking-[0.25em] text-xs"
              >
                <ArrowLeft size={16} strokeWidth={3} /> Back to mods
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* LEFT COLUMN - Image + Actions + Blog & Share */}
                <div className="md:col-span-5 lg:col-span-4 space-y-5">
                  {/* Game Card */}
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

                    {/* DOWNLOAD Button */}
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

                    {/* BLOG GUIDE Button */}
                    <motion.a
                      href={blogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        mt-2 w-full flex items-center justify-center gap-3
                        bg-amber-400 hover:bg-amber-700 active:bg-amber-800 text-white
                        font-black text-lg uppercase tracking-widest
                        rounded-2xl py-5 shadow-lg shadow-amber-500/30
                        active:translate-y-1 transition-all relative overflow-hidden border-2 border-amber-400/30
                      `}
                    >
                      
                      READ FULL GUIDE
                     
                    </motion.a>

                

                    {/* SHARE Section */}
                    <div className="mt-6 pt-5 border-t border-amber-200/40">
                      {/* <p className="text-center text-slate-600 text-sm font-black uppercase tracking-wider mb-4">
                        Share this mod
                      </p> */}

                      <div className="flex justify-center gap-4 flex-wrap">
                      
                        {/* <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={handleShare}
                          className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
                          aria-label="Share via system"
                        >
                          <Share2 size={28} strokeWidth={2} />
                        </motion.button>

                        <motion.a
                          whileTap={{ scale: 0.92 }}
                          href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                            `${game.title} Mod APK 2026 – Unlimited Everything! 🔥`
                          )}&url=${encodeURIComponent(shareUrl)}&hashtags=ModAPK,GamingMods`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-black text-white rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
                          aria-label="Share on X"
                        >
                          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </motion.a>

                        
                        <motion.a
                          whileTap={{ scale: 0.92 }}
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `${game.title} Mod APK 2026 – Free Download!\n\n${shareUrl}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-green-600 text-white rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
                          aria-label="Share on WhatsApp"
                        >
                          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-2.605-.003-5.158-.896-7.205-2.537l-.52-.398-5.393 1.414 1.44-5.252-.38-.537C1.46 12.607.5 9.98.5 7.188.5 3.37 3.37.5 7.188.5s6.688 2.87 6.688 6.688c0 3.818-2.87 6.688-6.688 6.688z" />
                          </svg>
                        </motion.a>

                     
                        <motion.a
                          whileTap={{ scale: 0.92 }}
                          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
                            `${game.title} Mod APK 2026 – Unlimited Everything!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-sky-500 text-white rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
                          aria-label="Share on Telegram"
                        >
                          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.417 15.181l-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.639-17.113c.373-1.747-.678-2.516-1.92-1.98l-17.155 6.625c-1.741.689-1.709 1.666-.303 2.081l4.285 1.336 9.922-6.229c.468-.293.932.057.606.357L9.417 15.181z" />
                          </svg>
                        </motion.a> */}
                      </div>
                    </div>
                  </div>

                  {/* Mini stats bar */}
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

                  {/* Features section */}
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