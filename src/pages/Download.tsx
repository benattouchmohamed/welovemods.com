'use client';
import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import {
  ShieldCheck,
  Fingerprint,
  ChevronRight,
  Zap,
  Lock,
  Star,
} from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

const LangPicker = lazy(() => import("./LangPicker"));

const BeautifulSkeleton = () => (
  <div className="min-h-screen bg-[#FFFBEB] px-4 py-6 space-y-6">
    <div className="flex justify-between items-center animate-pulse">
      <div className="w-28 h-8 bg-white/80 rounded-full" />
      <div className="w-10 h-10 bg-white/80 rounded-full" />
    </div>
    <div className="h-52 rounded-[2.25rem] bg-white/80 border-4 border-amber-100/60 shadow-xl animate-pulse" />
    <div className="h-14 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-200 animate-pulse" />
    <div className="h-64 bg-white rounded-[2.5rem] animate-pulse" />
  </div>
);

export default function DownloadPage() {
  const [locale] = useLocale();
  const i18n = useMemo(() => t(locale), [locale]);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameName, setGameName] = useState("Mod");
  const [gameImage, setGameImage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const onlineUsers = useMemo(() => Math.floor(Math.random() * 500) + 1200, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setGameName(params.get("game") || "Premium Mod");
    setGameImage(sessionStorage.getItem("downloadGameImage"));

    let mounted = true;
    const loadData = async () => {
      try {
        const data = await fetchOffers();
        if (mounted) setOffers(data || []);
      } finally {
        if (mounted) setTimeout(() => setLoading(false), 800);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  // Auto-rotate logic (paused on hover or during manual interaction)
  useEffect(() => {
    if (offers.length <= 1 || isPaused || isVerified) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [offers.length, isPaused, isVerified]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  if (loading) return <BeautifulSkeleton />;

  return (
    <div
      className="min-h-screen bg-[#FFFBEB] pb-8 font-sans overflow-x-hidden"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* ACTIVITY TICKER */}
      <div className="bg-slate-900 text-white py-2 overflow-hidden whitespace-nowrap border-b border-slate-800">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex gap-10 items-center text-[10px] font-black uppercase tracking-widest"
        >
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {onlineUsers} USERS ONLINE
          </span>
          <span className="text-amber-400">● New unlock: {gameName}</span>
          <span>● System Status: Secure</span>
        </motion.div>
      </div>

      <div className="w-full max-w-md mx-auto px-5 pt-5 pb-6 space-y-5">
        {/* HEADER */}
        <header className="flex justify-end">
          <Suspense fallback={<div className="w-3 h-3" />}>
             {/* <LangPicker /> */}
          </Suspense>
        </header>

        {/* HERO CARD */}
        <section className="rounded-[2.5rem] p-5 border-b-[8px] border-amber-400 shadow-2xl relative overflow-hidden border-2 border-slate-100 bg-white">
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden border-4 border-[#FFFBEB] shadow-xl rotate-[-2deg]">
                <img
                  src={gameImage || "/fallback-game.png"}
                  alt={gameName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-full border-4 border-white shadow-sm">
                <ShieldCheck size={14} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-black text-slate-900 leading-none uppercase italic tracking-tighter truncate">
                {gameName}
              </h1>
              <div className="inline-flex items-center gap-1.5 mt-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                <Lock size={10} />
                <span className="text-[9px] font-black uppercase tracking-widest">{i18n.syncing}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <h2 className="text-lg font-black text-slate-800 uppercase leading-tight tracking-tight">
              {i18n.completeTasks}
            </h2>
            <p className="text-slate-500 font-bold text-xs uppercase mt-0.5 opacity-70">
              {i18n.autoRedirect}
            </p>
          </div>
        </section>

        {/* VERIFICATION STATUS BAR */}
        <div className="py-3.5 px-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_#000] flex items-center bg-white text-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
            <span className="font-black text-[11px] uppercase tracking-wider italic">
              Verifying Completion...
            </span>
          </div>
        </div>

        {/* SWIPEABLE OFFER CAROUSEL */}
        <div
          className="relative px-1"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative min-h-[240px]">
            <AnimatePresence mode="wait">
              {offers.map((offer, idx) =>
                idx === currentIndex ? (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    i18n={i18n}
                    onVerify={() => setIsVerified(true)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                  />
                ) : null
              )}
            </AnimatePresence>
          </div>

          {offers.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {offers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    idx === currentIndex ? "w-6 bg-blue-600" : "w-1.5 bg-slate-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <footer className="text-center pt-3">
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] italic opacity-40">
            Validated Cloud Protocol v.2.0.4
          </p>
        </footer>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Offer Card with Swipe Gestures
// ────────────────────────────────────────────────
function OfferCard({
  offer,
  i18n,
  onVerify,
  onNext,
  onPrev,
}: {
  offer: Offer;
  i18n: any;
  onVerify: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = offer.description || "Follow internal steps to verify device and unlock link instantly.";
  const isLongText = description.length > 90;

  // Handle swipe completion
  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 100;
    if (info.offset.x < -swipeThreshold) {
      onNext(); // Swiped left -> next
    } else if (info.offset.x > swipeThreshold) {
      onPrev(); // Swiped right -> prev
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="
        absolute inset-0
        bg-white rounded-[2rem]
        p-4 pt-5
        shadow-2xl border-2 border-blue-500/10
        flex flex-col gap-3
        touch-none cursor-grab active:cursor-grabbing
      "
    >
      {/* Pulse border effect */}
      <div className="absolute inset-0 rounded-[2rem] border-2 border-blue-500/20 animate-pulse pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
          <img 
            src={offer.image || "/fallback-offer.png"} 
            alt={offer.title} 
            className="w-full h-full object-cover" 
            draggable={false}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-slate-900 uppercase text-sm leading-tight truncate">
            {offer.title}
          </h3>
          
          <div className="flex items-center gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className="text-yellow-500 fill-yellow-400 drop-shadow-sm"
                strokeWidth={2.5}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 mt-0.5">
            <Zap size={9} className="fill-blue-500 text-blue-500" />
            <span className="text-[8px] font-black text-blue-600 uppercase italic">High Success Rate</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="relative flex-grow-0">
        <div
          className={`text-slate-700 font-bold text-[11px] leading-snug uppercase tracking-tight ${
            isExpanded ? "max-h-[110px] overflow-y-auto pr-1" : "line-clamp-4"
          }`}
        >
          {description}
        </div>

        {isLongText && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-blue-600 text-[10px] font-black mt-1.5 uppercase underline decoration-2 underline-offset-2"
          >
            {isExpanded ? "Show Less" : "Show More..."}
          </button>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.open(offer.url, "_blank", "noopener,noreferrer");
          setTimeout(onVerify, 2500);
        }}
        className="
          mt-auto
          w-full flex items-center justify-center gap-2
          bg-blue-600 hover:bg-blue-700 active:bg-blue-800
          text-white font-black text-sm uppercase tracking-widest
          rounded-xl py-3.5
          shadow-lg active:translate-y-0.5 transition-all
          z-20
        "
      >
        <Fingerprint size={17} />
        {i18n.btn || "INSTALL & VERIFY"}
        <ChevronRight size={15} strokeWidth={3} />
      </button>
    </motion.div>
  );
}