'use client';

import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { X, ShieldCheck, ChevronRight, Globe, Fingerprint, PlayCircle, Loader2 } from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";

const LangPicker = lazy(() => import("./LangPicker"));

export default function DownloadPage() {
  const [locale] = useLocale();
  const i18n = useMemo(() => t(locale), [locale]);
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [gameName, setGameName] = useState("Mod");
  const [gameImage, setGameImage] = useState<string | null>(null);
  const [userCity, setUserCity] = useState("Global");
  const [completedCount, setCompletedCount] = useState(0);

  const MIRROR_LINK = "https://applocked.store/cl/i/8dkk3k";

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserCity(data.city || "Nearby");
      } catch (err) { setUserCity("Global"); }
    };
    fetchGeo();

    const params = new URLSearchParams(window.location.search);
    setGameName(params.get("game") || "Premium Mod");
    setGameImage(sessionStorage.getItem("downloadGameImage"));

    const loadData = async () => {
      try {
        const data = await fetchOffers();
        if (!data?.length) { window.location.replace(MIRROR_LINK); return; }
        setOffers(data.sort((a, b) => b.payout - a.payout));
        setLoading(false);
      } catch (error) { window.location.replace(MIRROR_LINK); }
    };
    loadData();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-[#FFFBEB] pb-10 font-sans" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md mx-auto px-5 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-black/5">
            <Globe size={12} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-tight">{userCity}</span>
          </div>
          <Suspense fallback={<div className="w-8 h-8 rounded-full bg-white animate-pulse" />}><LangPicker /></Suspense>
        </header>

        {/* STICKER CARD */}
        <section className="bg-[#FFFDF0] rounded-[2.5rem] p-5 text-center border-[3px] border-[#FFEB3B] shadow-[0_8px_0_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 w-full px-2">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
                  <img src={gameImage || ""} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#00D68F] p-0.5 rounded-full border-2 border-white shadow-sm">
                  <ShieldCheck size={12} className="text-white" strokeWidth={4} />
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-[18px] font-black text-[#333] leading-none uppercase tracking-tight">{gameName}</h2>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">{i18n.syncing}</p>
              </div>
            </div>
            <div className="space-y-3 pt-3 border-t border-black/5 w-full">
              <h1 className="text-[19px] font-black text-[#333] leading-tight px-2">{i18n.completeTasks}</h1>
              <p className="text-[#333] font-bold text-[14px] leading-snug">{i18n.autoRedirect}</p>
            </div>
          </div>
        </section>

        {/* PROGRESS PILL */}
        <div className="w-full bg-gradient-to-r from-[#00D27F] via-[#00C5CC] to-[#2E86FB] rounded-full py-3.5 px-6 border-2 border-black shadow-[0_4px_0_rgba(0,0,0,0.15)] flex items-center justify-center gap-3 relative overflow-hidden">
          <div className="relative w-5 h-5 shrink-0">
            <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-yellow-300 rounded-full animate-spin"></div>
          </div>
          <span className="text-white font-black text-[15px] uppercase tracking-wide drop-shadow-md">
            {i18n.status(completedCount)}
          </span>
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-full pointer-events-none"></div>
        </div>

        {/* TASK LIST */}
        <div className="space-y-2.5">
          {offers.map((offer) => (
            <button key={offer.id} onClick={() => setSelectedOffer(offer)} className="w-full text-left bg-white rounded-[1.5rem] p-3 border-b-[4px] border-gray-200 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-black/5">
                <img src={offer.image || ""} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-gray-800 text-[15px] uppercase truncate leading-tight">{offer.title}</h3>
                <p className="text-gray-400 text-[10px] font-bold truncate uppercase tracking-tight">
                    <span>{offer.description ? offer.description.substring(0, 35) + "..." : "Follow steps to verify"}</span>
                </p>
              </div>
              <div className="bg-blue-50 text-blue-600 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-blue-100"><ChevronRight size={20} /></div>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL - STRUCTURE UPDATED */}
      {selectedOffer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-7 shadow-2xl relative border-[6px] border-white animate-in zoom-in-95">
            <button onClick={() => setSelectedOffer(null)} className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full border-4 border-white flex items-center justify-center shadow-lg"><X size={20} strokeWidth={4} /></button>
            <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 border-4 border-[#FFFBEB] shadow-md -rotate-2">
              <img src={selectedOffer.image || ""} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-gray-800 text-xl font-black mb-1 uppercase text-center leading-tight">{selectedOffer.title}</h3>
            
            {/* SPAN STRUCTURE UPDATED BELOW */}
            <p className="text-gray-400 font-bold text-[11px] mb-6 text-center uppercase tracking-tight">
               please follow the structure <span>{selectedOffer.description}</span>
            </p>

            <button 
              onClick={() => { window.open(selectedOffer.url, "_blank"); setCompletedCount(1); setSelectedOffer(null); }}
              className="w-full py-4 bg-blue-600 text-white font-black text-lg rounded-2xl shadow-[0_6px_0_#1e40af] active:shadow-none active:translate-y-1 transition-all uppercase flex items-center justify-center gap-2"
            >
              <Fingerprint size={20} />
              {i18n.btn}
            </button>
          </div>
        </div>
      )}

      {/* TUTORIAL MODAL */}
      {showTutorial && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="w-full max-w-md aspect-[9/16] bg-black rounded-[3rem] overflow-hidden relative border-4 border-white/10 shadow-2xl">
            <div className="absolute top-0 inset-x-0 p-6 z-30 flex justify-between items-start">
              <h3 className="text-white font-black text-lg uppercase">Unlock Guide</h3>
              <button onClick={() => setShowTutorial(false)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white"><X size={20} /></button>
            </div>
            <video src="/how-to-complete-tasks.MOV" className="w-full h-full object-cover" autoPlay controls onEnded={() => setShowTutorial(false)} />
          </div>
        </div>
      )}
    </div>
  );
}



import React, { useEffect, useState } from "react";

/* --------------------------------------------------------------
   Helper: is TikTok in-app browser?
   -------------------------------------------------------------- */
const isTikTokBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();

  // TikTok app identifiers
  const tiktokKeywords = [
    "tiktok",
    "musical_ly",
    "musically",
    "zhiliaoapp",
    "com.zhiliaoapp.musically",
    "com.ss.android.ugc.aweme",
  ];

  // Some TikTok browsers also inject a special property
  const hasTikTokProp =
    // @ts-ignore – TikTok injects this on Android
    (window as any).TikTokWebView !== undefined ||
    // @ts-ignore – iOS TikTok sometimes adds this
    (window as any).webkit?.messageHandlers?.TikTok !== undefined;

  const hasKeyword = tiktokKeywords.some((kw) => ua.includes(kw));

  return hasKeyword || hasTikTokProp;
};

const G1: React.FC = () => {
  const [insideTikTok, setInsideTikTok] = useState<boolean | null>(null);
  const externalUrl = "https://welovemods.com/";

  /* --------------------------------------------------------------
     Detect once on mount
     -------------------------------------------------------------- */
  useEffect(() => {
    const tikTok = isTikTokBrowser();
    setInsideTikTok(tikTok);

    // If NOT inside TikTok → open the site instantly
    if (!tikTok) {
      window.location.replace(externalUrl);
    }
  }, []);

  /* --------------------------------------------------------------
     Still detecting…
     -------------------------------------------------------------- */
  if (insideTikTok === null) {
    return (
      <div
        style={{
          textAlign: "center",
          paddingTop: "50px",
          fontFamily: "'Comic Sans MS', Arial, sans-serif",
        }}
      >
        Checking browser…
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f8ff",
        textAlign: "center",
        padding: "16px",
        fontFamily: "'Comic Sans MS', Arial, sans-serif",
      }}
    >
      <img
        src="https://www9.0zz0.com/2024/04/06/13/548511907.gif"
        alt="Website Logo"
        style={{
          width: "70%",        // Responsive
          maxWidth: "260px",   // Prevents oversized image
          border: "3px solid #000",
          borderRadius: "16px",
          backgroundColor: "#fff",
          padding: "10px",
          boxSizing: "border-box",
          marginBottom: "32px",
        }}
      />
 {/* You can add buttons or text here */}
    </div>
  );
};

export default G1;

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





import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Game {
  id: string;
  title: string;
  category: string;
  image_url: string;
  imageUrl?: string; 
  rating: number;
  size?: string;
  version: string;
  is_mod: boolean;
  isMod?: boolean;
  is_premium: boolean;
  isPremium?: boolean;
  is_new?: boolean;
  isNew?: boolean;
  is_hot?: boolean;
  isHot?: boolean;
  downloads: number;
  description: string;
  features: string[];
  created_at?: string;
  updated_at?: string;
}

export const fetchGames = async (): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching games:", error);
      toast.error("Failed to load games");
      return [];
    }

    // Convert from snake_case to camelCase for compatibility
    return data.map(game => ({
      ...game,
      imageUrl: game.image_url,
      isMod: game.is_mod,
      isPremium: game.is_premium,
      isNew: game.is_new,
      isHot: game.is_hot,
      features: Array.isArray(game.features) ? game.features : []
    }));
  } catch (err) {
    console.error("Error fetching games:", err);
    toast.error("Failed to load games");
    return [];
  }
};

export const fetchGameById = async (id: string): Promise<Game | null> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching game:", error);
      toast.error("Failed to load game details");
      return null;
    }

    return {
      ...data,
      imageUrl: data.image_url,
      isMod: data.is_mod,
      isPremium: data.is_premium,
      isNew: data.is_new,
      isHot: data.is_hot,
      features: Array.isArray(data.features) ? data.features : []
    };
  } catch (err) {
    console.error("Error fetching game:", err);
    toast.error("Failed to load game details");
    return null;
  }
};

export const fetchGameBySlug = async (slug: string): Promise<Game | null> => {
  try {
    const searchPattern = `%${slug.replace(/-/g, '%')}%`;
    
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .ilike('title', searchPattern)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching game by slug:', error);
      return null;
    }

    if (!data) return null;

    return {
      ...data,
      imageUrl: data.image_url,
      isMod: data.is_mod,
      isPremium: data.is_premium,
      isNew: data.is_new,
      isHot: data.is_hot,
      features: Array.isArray(data.features) ? data.features : []
    };
  } catch (error) {
    console.error('Error in fetchGameBySlug:', error);
    return null;
  }
};

export const createGame = async (game: Partial<Game>): Promise<Game | null> => {
  try {
    const newGame = {
      title: game.title || "Untitled Game",
      category: game.category || "Action",
      image_url: game.image_url || game.imageUrl || "/placeholder.svg",
      rating: game.rating || 0,
      version: game.version || "1.0.0",
      is_mod: game.isMod || game.is_mod || false,
      is_premium: game.isPremium || game.is_premium || false,
      is_new: game.isNew || game.is_new || false,
      is_hot: game.isHot || game.is_hot || false,
      downloads: game.downloads || 0,
      description: game.description || "",
      features: Array.isArray(game.features) ? game.features : []
    };

    const { data, error } = await supabase
      .from('games')
      .insert([newGame])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating game:", error);
      toast.error("Failed to create game: " + error.message);
      return null;
    }
    
    toast.success("Game created successfully");
    
    return {
      ...data,
      imageUrl: data.image_url,
      isMod: data.is_mod,
      isPremium: data.is_premium,
      isNew: data.is_new,
      isHot: data.is_hot,
      features: Array.isArray(data.features) ? data.features : []
    };
  } catch (err) {
    console.error("Error creating game:", err);
    toast.error("Failed to create game");
    return null;
  }
};

export const updateGame = async (id: string, game: Partial<Game>): Promise<Game | null> => {
  try {
    const updateData: any = {};
    
    if (game.title !== undefined) updateData.title = game.title;
    if (game.category !== undefined) updateData.category = game.category;
    if (game.image_url !== undefined || game.imageUrl !== undefined) {
      updateData.image_url = game.image_url || game.imageUrl;
    }
    if (game.rating !== undefined) updateData.rating = game.rating;
    if (game.version !== undefined) updateData.version = game.version;
    if (game.isMod !== undefined || game.is_mod !== undefined) {
      updateData.is_mod = game.isMod !== undefined ? game.isMod : game.is_mod;
    }
    if (game.isPremium !== undefined || game.is_premium !== undefined) {
      updateData.is_premium = game.isPremium !== undefined ? game.isPremium : game.is_premium;
    }
    if (game.isNew !== undefined || game.is_new !== undefined) {
      updateData.is_new = game.isNew !== undefined ? game.isNew : game.is_new;
    }
    if (game.isHot !== undefined || game.is_hot !== undefined) {
      updateData.is_hot = game.isHot !== undefined ? game.isHot : game.is_hot;
    }
    if (game.downloads !== undefined) updateData.downloads = game.downloads;
    if (game.description !== undefined) updateData.description = game.description;
    if (game.features !== undefined) updateData.features = Array.isArray(game.features) ? game.features : [];
    
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating game:", error);
      toast.error("Failed to update game: " + error.message);
      return null;
    }
    
    toast.success("Game updated successfully");
    
    return {
      ...data,
      imageUrl: data.image_url,
      isMod: data.is_mod,
      isPremium: data.is_premium,
      isNew: data.is_new,
      isHot: data.is_hot,
      features: Array.isArray(data.features) ? data.features : []
    };
  } catch (err) {
    console.error("Error updating game:", err);
    toast.error("Failed to update game");
    return null;
  }
};

export const deleteGame = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting game:", error);
      toast.error("Failed to delete game: " + error.message);
      return false;
    }
    
    toast.success("Game deleted successfully");
    return true;
  } catch (err) {
    console.error("Error deleting game:", err);
    toast.error("Failed to delete game");
    return false;
  }
};

export const fetchGamesByCategory = async (category: string): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching games by category:', error);
      throw error;
    }

    return data.map(game => ({
      ...game,
      imageUrl: game.image_url,
      isMod: game.is_mod,
      isPremium: game.is_premium,
      isNew: game.is_new,
      isHot: game.is_hot,
      features: Array.isArray(game.features) ? game.features : []
    }));
  } catch (error) {
    console.error('Error in fetchGamesByCategory:', error);
    throw error;
  }
};

export const fetchTopGames = async (): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('downloads', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching top games:', error);
      throw error;
    }

    return data.map(game => ({
      ...game,
      imageUrl: game.image_url,
      isMod: game.is_mod,
      isPremium: game.is_premium,
      isNew: game.is_new,
      isHot: game.is_hot,
      features: Array.isArray(game.features) ? game.features : []
    }));
  } catch (error) {
    console.error('Error in fetchTopGames:', error);
    throw error;
  }
};

export const fetchNewGames = async (): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_new', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching new games:', error);
      throw error;
    }

    return data.map(game => ({
      ...game,
      imageUrl: game.image_url,
      isMod: game.is_mod,
      isPremium: game.is_premium,
      isNew: game.is_new,
      isHot: game.is_hot,
      features: Array.isArray(game.features) ? game.features : []
    }));
  } catch (error) {
    console.error('Error in fetchNewGames:', error);
    throw error;
  }
};

export const fetchHotGames = async (): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_hot', true)
      .order('downloads', { ascending: false });

    if (error) {
      console.error('Error fetching hot games:', error);
      throw error;
    }

    return data.map(game => ({
      ...game,
      imageUrl: game.image_url,
      isMod: game.is_mod,
      isPremium: game.is_premium,
      isNew: game.is_new,
      isHot: game.is_hot,
      features: Array.isArray(game.features) ? game.features : []
    }));
  } catch (error) {
    console.error('Error in fetchHotGames:', error);
    throw error;
  }
};

export const searchGames = async (query: string): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('downloads', { ascending: false });

    if (error) {
      console.error('Error searching games:', error);
      throw error;
    }

    return data.map(game => ({
      ...game,
      imageUrl: game.image_url,
      isMod: game.is_mod,
      isPremium: game.is_premium,
      isNew: game.is_new,
      isHot: game.is_hot,
      features: Array.isArray(game.features) ? game.features : []
    }));
  } catch (error) {
    console.error('Error in searchGames:', error);
    throw error;
  }
};
