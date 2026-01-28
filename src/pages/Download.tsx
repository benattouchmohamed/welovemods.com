'use client';
import React, { useEffect, useState, useMemo } from "react";
import {
  ShieldCheck,
  Fingerprint,
  Star,
  Loader2,
  X,
  ShieldAlert,
  Smile  ,
  Cpu,
} from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

export default function DownloadPage() {
  const [locale] = useLocale();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  
  const [gameName, setGameName] = useState("Mod");
  const [gameImage, setGameImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const fallbackUrl = "https://applocked.store/cl/i/8dkk3k";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" strokeWidth={1.5} />
          <div className="absolute inset-0 blur-xl bg-blue-400/20 animate-pulse" />
        </div>
 <div className="text-center space-y-2">
          <p className="text-slate-800 font-black text-lg uppercase tracking-wide">
            Verifying you're not a bot...
          </p>
          <p className="text-slate-500 text-sm">Please wait a moment</p>
        </div>
      </div>
      
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] pb-10 font-sans overflow-x-hidden" dir={locale === "ar" ? "rtl" : "ltr"}>
      
      {/* 1. STATUS BAR */}
      <div className="bg-white border-b border-slate-100 py-3 px-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{onlineUsers} ACTIVE </span>
        </div>
       
      </div>

      <div className="w-full max-w-md mx-auto px-6 pt-8 space-y-10">
        
        {/* 2. HEADER */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] border-2 border-white">
              <img src={gameImage || "/fallback-game.png"} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{gameName}</h1>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Ready for decryption</p>
          </div>
            <p className="text-blue-600 text-[10px] font-black uppercase leading-tight text-center">
  Complete this{" "}
  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
    (1) task
  </span>{" "}
  to prove you are not a bot and unlock your file instantly.
</p>

        </motion.section>

        {/* 3. STEPPER */}
     <div className="flex items-center justify-between px-8 relative">
  {/* progress line */}
  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 -translate-y-1/2 z-0" />

  {[1, 2, 3].map((step) => {
    const isCompleted = step < 2
    const isActive = step === 2

    return (
      <div
        key={step}
        className={`
          relative z-10 w-8 h-8 rounded-full border-2
          flex items-center justify-center text-[11px] font-bold
          transition-all duration-500
          ${
            isCompleted
              ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200"
              : isActive
              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
              : "bg-white border-slate-300 text-slate-400"
          }
        `}
      >
        {isCompleted ? <CheckCircleIcon  /> : step}
      </div>
    )
  })}
</div>


        {/* 4. OFFER CARD & NAVIGATION */}
        {offers.length > 0 ? (
          <div className="relative">
            <AnimatePresence mode="wait">
              <InteractiveOfferCard 
                key={offers[currentIndex].id}
                offer={offers[currentIndex]}
                onSwipe={(dir) => {
                  if (offers.length <= 1) return;
                  if(dir === 'left') setCurrentIndex((prev) => (prev + 1) % offers.length);
                  else setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
                }}
              />
            </AnimatePresence>
            
            {/* Nav only if more than 1 offer */}
            {offers.length > 1 && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Swipe to Explore verified tasks</p>
                <div className="flex items-center gap-5">
              <button
  onClick={() =>
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length)
  }
  className="
    p-3 rounded-full
    bg-white/90 backdrop-blur
    shadow-[0_10px_20px_rgba(0,0,0,0.12)]
    border border-slate-100
    hover:shadow-[0_12px_25px_rgba(37,99,235,0.25)]
    hover:text-blue-600
    active:scale-90
    transition-all duration-300
    text-slate-600
  "
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
</button>

<div className="flex items-center gap-1.5">
  {offers.map((_, i) => (
    <div
      key={i}
      className={`
        h-1.5 rounded-full
        transition-all duration-500
        ${
          i === currentIndex
            ? "w-8 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
            : "w-2 bg-slate-300"
        }
      `}
    />
  ))}
</div>

<button
  onClick={() =>
    setCurrentIndex((prev) => (prev + 1) % offers.length)
  }
  className="
    p-3 rounded-full
    bg-white/90 backdrop-blur
    shadow-[0_10px_20px_rgba(0,0,0,0.12)]
    border border-slate-100
    hover:shadow-[0_12px_25px_rgba(37,99,235,0.25)]
    hover:text-blue-600
    active:scale-90
    transition-all duration-300
    text-slate-600
  "
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
</button>

                </div>
              </div>
            )}
          </div>
        ) : (
      <div className="bg-white rounded-[2.5rem] p-10 text-center border border-slate-100 shadow-xl">
      <button
        onClick={() => setIframeUrl(fallbackUrl)}
        className="
          mt-4 px-6 py-3
          bg-green-600 text-white font-black text-xs uppercase tracking-widest
          rounded-[1.5rem]
          shadow-lg shadow-blue-200/40
          hover:bg-blue-500 hover:shadow-xl
          active:scale-95 transition-all duration-300
        "
      >
        Click here to start download
      </button>
     
    </div>
        )}
      </div>

      {/* IFRAME OVERLAY */}
      <AnimatePresence>
        {iframeUrl && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[100] bg-white flex flex-col">
            <div className="p-5 flex justify-between items-center border-b shadow-sm">
             
             

            </div>

            <div className="flex-1 relative">
              {iframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                  <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <iframe src={iframeUrl} onLoad={() => setIframeLoading(false)} className="w-full h-full border-none" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InteractiveOfferCard({ offer, onSwipe }: { offer: Offer, onSwipe: (dir: 'left' | 'right') => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-10, 10]);
  const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -80) onSwipe('left');
        else if (info.offset.x > 80) onSwipe('right');
      }}
      className="bg-white rounded-[3rem] p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-slate-50 flex flex-col items-center text-center cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full mb-6 shadow-sm">
        <UserCheckIcon />
        <span className="text-[10px] font-black uppercase tracking-wider">Bot Protection Active</span>
      </div>

  <div className="
  w-12 h-12 rounded-xl overflow-hidden shrink-0
  bg-white
  border border-black/5
  shadow-[0_8px_18px_rgba(0,0,0,0.12)]
  ring-1 ring-white/60
">
  <img
    src={offer.image || ""}
    alt=""
    className="
      w-full h-full object-cover
      transition-transform duration-300
      hover:scale-105
    "
  />
</div>

      
      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2 leading-tight">{offer.title}</h3>
      
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-slate-600 text-[13px] font-bold leading-relaxed px-2 italic">"{offer.description}"</p>
     
      </div>

      <button
        onClick={() => window.open(offer.url, "_blank")}
        className="group relative w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] overflow-hidden transition-all active:scale-95 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)]"
      >
        <span className="relative z-10 flex items-center justify-center gap-3 text-[11px] tracking-[0.2em]">
          <Fingerprint size={18} strokeWidth={2.5} /> VERIFY IDENTITY
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </motion.div>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function UserCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <polyline points="17 11 19 13 23 9"></polyline>
    </svg>
  );
}