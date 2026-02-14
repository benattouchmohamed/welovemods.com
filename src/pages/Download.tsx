'use client';
import React, { useEffect, useState } from "react";
import { 
  Loader2, 
  Fingerprint, 
  Star, 
  ShieldCheck, 
  Download, 
  Lock,
  ChevronRight,
  Gamepad2
} from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale } from "@/hooks/useLocale";
import { motion } from "framer-motion";

export default function DownloadPage() {
  const [locale] = useLocale();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [gameName, setGameName] = useState("Premium Mod");
  const [gameImage, setGameImage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams(window.location.search);
    setGameName(params.get("game") || "Premium Mod");
    setGameImage(sessionStorage.getItem("downloadGameImage"));

    const loadData = async () => {
      try {
        const data = await fetchOffers();
        setOffers(data || []);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    loadData();
  }, []);

  const injectTrackingScript = () => {
    if (document.getElementById("ogjs")) return;
    const script = document.createElement("script");
    script.id = "ogjs";
    script.src = "https://lockedapp.store/cl/js/8dkk3k";
    script.async = true;
    document.head.appendChild(script);
  };

  const handleDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    injectTrackingScript();
    setTimeout(() => setIsDownloading(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="mt-4 font-black text-slate-800 uppercase text-[10px] tracking-widest">Initialising...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] pb-12 font-sans overflow-x-hidden" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-md mx-auto px-6 pt-10">
        
        {/* HEADER */}
        <header className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 mx-auto rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white mb-5"
          >
            <img src={gameImage || "/fallback-game.png"} alt="Game" className="w-full h-full object-cover" />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter leading-none mb-2">
            {gameName}
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-bold text-[9px] uppercase tracking-wider">
            <ShieldCheck size={12} /> Verification Active
          </div>
        </header>

        {/* SERVER DOWNLOAD BUTTON */}
        <div className="mb-8">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`group w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 shadow-xl ${
              isDownloading ? "bg-slate-100 text-slate-400" : "bg-slate-900 text-white hover:bg-blue-700 active:scale-95"
            }`}
          >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} strokeWidth={3} />}
            <span>{isDownloading ? "Connecting..." : "Server Download 2"}</span>
          </button>
        </div>

        {/* INSTRUCTION TEXT */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-6 text-center shadow-sm">
          <p className="text-slate-600 text-[13px] font-bold leading-relaxed">
            Complete <span className="text-blue-600 animate-pulse">1 task</span> below to prove you're not a bot and unlock your game instantly.
          </p>
        </div>

        {/* TASK LIST */}
        <section className="space-y-3">
          {offers.length > 0 ? (
            offers.map((offer, idx) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => window.open(offer.url, "_blank")}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-all active:scale-[0.98]"
              >
                <img src={offer.image || ""} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-black text-slate-900 truncate uppercase">{offer.title}</h3>
                  <div className="flex gap-0.5 my-0.5">
                    {[...Array()].map((_, i) => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}
                  </div>
<p className="text-[10px] text-slate-400 font-medium italic">
                    {offer.description?.length >100 
                      ? `${offer.description.substring(0, 130)}...` 
                      : offer.description}
                  </p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <Fingerprint size={18} strokeWidth={2.5} />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10">
              <Lock className="mx-auto text-slate-200 mb-2" size={24} />
              <p className="text-slate-400 text-[10px] font-bold uppercase">No Tasks Available</p>
            </div>
          )}
        </section>

        <footer className="mt-10 text-center opacity-50">
          <div className="flex justify-center gap-4 mb-2">
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
          </div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Secure Cloud Gateway v4.0</p>
        </footer>
      </div>
    </div>
  );
}