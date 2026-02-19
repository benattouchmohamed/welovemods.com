'use client';
import React, { useEffect, useState, useMemo, lazy, Suspense, useRef } from "react";
import {
  ShieldCheck,
  Fingerprint,
  ChevronRight,
  Zap,
  Lock,
  Star,
  Loader2,
  X,
  ChevronLeft,
  Terminal,
  Activity,
  UserCheck,
  AlertCircle
} from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 6;

export default function DownloadPage() {
  const [locale] = useLocale();
  const i18n = useMemo(() => t(locale), [locale]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameName, setGameName] = useState("Mod");
  const [gameImage, setGameImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
        if (mounted) setTimeout(() => setLoading(false), 1200);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  const totalPages = Math.ceil(offers.length / ITEMS_PER_PAGE);
  const currentOffers = offers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) return (
    <div className="min-h-screen bg-[#FDF4D3] flex flex-col items-center justify-center font-sans">
      <div className="w-20 h-20 border-8 border-black border-t-[#FF814D] rounded-full animate-spin shadow-[6px_6px_0_#000]" />
      <p className="mt-8 font-black text-2xl uppercase italic tracking-tighter">Bypassing Bot Detection...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF4D3] pb-20 font-sans text-black selection:bg-[#FF814D]">
      {/* 1. TOP TICKER */}
      <div className="bg-black text-white py-3 overflow-hidden border-b-4 border-black sticky top-0 z-50">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex gap-16 items-center text-xs font-black uppercase italic tracking-[0.2em]"
        >
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-2"><Activity size={14} className="text-[#FF814D]" /> ENCRYPTED CONNECTION ESTABLISHED</span>
              <span className="text-[#FF814D]">● AWAITING HUMAN INPUT ●</span>
              <span>VERIFYING DEVICE COMPATIBILITY...</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-10 space-y-8">
        
        {/* 2. MAIN INSTRUCTION BANNER (NEW) */}
        <section className="bg-[#FF814D] border-4 border-black rounded-[1.5rem] p-4 shadow-neo flex items-center gap-4 animate-bounce-subtle">
          <div className="bg-black text-white p-3 rounded-xl">
             <UserCheck size={32} strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase italic leading-none">Human Verification Required</h2>
            <p className="font-bold text-sm uppercase mt-1">Complete <span className="underline decoration-2">1 task</span> below to unlock your game instantly.</p>
          </div>
        </section>

        {/* 3. GAME HEADER */}
        <section className="relative">
          <div className="absolute -inset-2 bg-black rounded-[2.5rem] rotate-1 opacity-10" />
          <div className="relative bg-white border-4 border-black rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-8 shadow-neo-md">
            {/* <div className="relative">
              <img 
                src={gameImage || "/fallback.png"} 
                className="w-28 h-28 md:w-32 md:h-32 rounded-[1.5rem] border-4 border-black shadow-neo-orange object-cover" 
              />
              <div className="absolute -bottom-3 -right-3 bg-white border-4 border-black p-2 rounded-xl">
                <Lock size={20} strokeWidth={3} className="text-[#FF814D]" />
              </div>
            </div> */}
            
            <div className="text-center md:text-left space-y-2 flex-1">
              <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                {gameName} <span className="text-[#FF814D]">LOCKED</span>
              </h1>
              <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Device: Detected & Verified | Status: Ready to Install</p>
            </div>
          </div>
        </section>

        {/* 4. TASK LIST HEADER */}
        <div className="bg-black text-white px-6 py-4 rounded-2xl flex justify-between items-center shadow-neo">
           <div className="flex items-center gap-3">
              <AlertCircle className="text-[#FF814D]" size={20} strokeWidth={3} />
              <span className="font-black uppercase tracking-widest text-sm">Select 1 Offer to Verify</span>
           </div>
           <span className="hidden sm:block font-mono text-[10px] opacity-60">ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
        </div>

        {/* 5. THE OFFERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 pt-4">
             <button onClick={() => setCurrentPage(p => p-1)} disabled={currentPage === 1} className="bg-white border-4 border-black p-3 rounded-xl shadow-neo disabled:opacity-30">
                <ChevronLeft strokeWidth={4} />
             </button>
             <div className="bg-white border-4 border-black px-6 flex items-center font-black rounded-xl shadow-neo">
                {currentPage} / {totalPages}
             </div>
             <button onClick={() => setCurrentPage(p => p+1)} disabled={currentPage === totalPages} className="bg-white border-4 border-black p-3 rounded-xl shadow-neo disabled:opacity-30">
                <ChevronRight strokeWidth={4} />
             </button>
          </div>
        )}

      </div>
    </div>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white border-4 border-black rounded-[2rem] p-6 shadow-neo-lg flex flex-col h-full group"
    >
      <div className="flex gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl border-4 border-black overflow-hidden bg-gray-50 shadow-neo shrink-0">
          <img src={offer.image} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <Star size={12} className="fill-yellow-400" />
            <span className="text-[10px] font-black uppercase">Instant Unlock</span>
          </div>
          <h3 className="font-black text-lg leading-none uppercase tracking-tight truncate">{offer.title}</h3>
        </div>
      </div>

      <p className="font-bold text-gray-600 text-[13px] leading-tight mb-6 flex-1 italic">
        "Complete this quick offer to verify you are human and unlock {offer.title} instantly."
      </p>

      <button
        onClick={() => window.open(offer.url, "_blank")}
        className="w-full bg-[#FF814D] border-4 border-black rounded-xl py-4 font-black text-base uppercase italic tracking-tighter shadow-neo group-hover:bg-[#ff966c] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
      >
        <Fingerprint size={20} strokeWidth={3} />
        Complete & Verify
        <ChevronRight size={18} strokeWidth={4} />
      </button>
    </motion.div>
  );
}