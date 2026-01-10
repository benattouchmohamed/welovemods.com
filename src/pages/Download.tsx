'use client';

import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { X, ShieldCheck, ChevronRight, Globe, Fingerprint, Activity, ShieldPlus, PlayCircle, Loader2 } from "lucide-react";
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
  const [videoLoading, setVideoLoading] = useState(true); // NEW: Video loading state
  const [gameName, setGameName] = useState("Mod");
  const [gameImage, setGameImage] = useState<string | null>(null);
  
  const [userCity, setUserCity] = useState("Global");
  const [showToast, setShowToast] = useState(false);
  const [recentWinner, setRecentWinner] = useState({ name: "User741", city: "London" });
  const [progress, setProgress] = useState(0);

  const MIRROR_LINK = "https://applocked.store/cl/i/8dkk3k";

  // Progress Bar Logic
  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 99 ? prev + 1 : 99));
      }, 20);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Geo-location Logic
  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserCity(data.city || "Nearby");
      } catch (err) { setUserCity("Global"); }
    };
    fetchGeo();
  }, []);

  // Live Notifications
  useEffect(() => {
    const names = ["Alex", "Sultan", "Matteo", "Yuki", "Priya", "Carlos", "Emma", "Muller"];
    const cities = ["New York", "Dubai", "Rome", "Tokyo", "Mumbai", "Madrid", "Berlin", "Paris"];
    const interval = setInterval(() => {
      setRecentWinner({
        name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 99),
        city: cities[Math.floor(Math.random() * cities.length)]
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Data Loading
  useEffect(() => {
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

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-cartoon-cream flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-[5px] border-cartoon-purple/10 border-t-cartoon-purple rounded-full animate-spin mb-4" />
        <p className="font-black text-cartoon-purple/40 text-[9px] uppercase tracking-[0.2em] text-center">Establishing Secure Tunnel</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-cartoon-cream selection:bg-cartoon-purple/20 overflow-x-hidden pb-10" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* NOTIFICATION TOAST */}
      <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:top-auto sm:w-72 z-[600] transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
        <div className="bg-white/95 backdrop-blur-md border-2 border-cartoon-green/20 p-3 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="w-9 h-9 bg-cartoon-green/10 rounded-xl flex items-center justify-center text-cartoon-green flex-shrink-0">
            <ShieldPlus size={18} />
          </div>
          <p className="text-[11px] font-bold text-gray-800 leading-tight">
             <span className="text-cartoon-purple font-black">{recentWinner.name}</span> verified from {recentWinner.city}
          </p>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-5 pt-4 space-y-4">
        
        <header className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
              <Globe size={10} className="text-cartoon-purple" />
              <span className="opacity-70">{i18n.playerFrom}</span> <span className="text-gray-900">{userCity}</span>
            </div>
          </div>
          <Suspense fallback={<div className="w-8 h-8 rounded-full bg-white animate-pulse" />}>
            <LangPicker />
          </Suspense>
        </header>

        {/* HERO SECTION */}
        <section className="bg-white rounded-[2.5rem] p-6 text-center border-[4px] border-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cartoon-purple/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            {gameImage && (
              <div className="relative flex justify-center mb-4">
                <div className="w-20 h-20 rounded-3xl overflow-hidden border-[4px] border-cartoon-cream shadow-lg relative group active:scale-95 transition-transform">
                    <img src={gameImage} alt={gameName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-cartoon-purple/10 flex items-center justify-center">
                        <ShieldCheck size={24} className="text-white drop-shadow-md" />
                    </div>
                </div>
              </div>
            )}
            <h1 className="text-[26px] font-black text-gray-800 leading-[1.1] mb-2 uppercase font-cartoon tracking-tight">
              {i18n.completeOneTask}
            </h1>
            <p className="text-cartoon-yellow-dark font-black text-[10px] uppercase tracking-tighter bg-cartoon-yellow/10 inline-block px-4 py-1.5 rounded-xl border border-cartoon-yellow/10">
              {i18n.gameReady.replace("{game}", gameName)}
            </p>
          </div>
        </section>

        {/* PROGRESS BOX */}
        <div className="bg-white rounded-[2rem] p-5 shadow-lg border-b-4 border-black/5 space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-cartoon-purple font-black text-[9px] uppercase tracking-widest leading-none mb-1">{i18n.autoRedirect}</p>
              <p className="text-gray-800 font-black text-sm uppercase">{i18n.offersCompleted(0, 1)}</p>
            </div>
            <div className="text-right">
                <p className="text-cartoon-green font-black text-[8px] uppercase animate-pulse mb-0.5">Syncing...</p>
                <p className="text-gray-900 font-black text-2xl italic leading-none tracking-tighter transition-all">
                  {progress}%
                </p>
            </div>
          </div>
          <div className="h-3 w-full bg-cartoon-cream rounded-full border-2 border-white shadow-inner overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-cartoon-purple via-cartoon-pink to-cartoon-purple bg-[length:200%_100%] animate-[gradient_2s_linear_infinite] transition-all duration-500 ease-out" 
               style={{ width: `${progress}%` }}
             />
          </div>
        </div>

        {/* TUTORIAL TRIGGER */}
        <div className="px-2">
          <button 
            onClick={() => { setShowTutorial(true); setVideoLoading(true); }}
            className="w-full py-3.5 bg-white border-2 border-dashed border-cartoon-purple/30 rounded-2xl flex items-center justify-center gap-2 group hover:border-cartoon-purple transition-all active:scale-95"
          >
            <div className="w-7 h-7 bg-cartoon-purple/10 rounded-lg flex items-center justify-center text-cartoon-purple">
              <PlayCircle size={18} className="animate-pulse" />
            </div>
            <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest group-hover:text-cartoon-purple">
               {i18n.howToComplete || "Tutorial: How to Unlock"}
            </span>
          </button>
        </div>

        {/* TASK LIST */}
        <div className="space-y-4">
          {offers.map((offer, index) => (
            <button 
              key={offer.id}
              onClick={() => setSelectedOffer(offer)}
              style={{ animationDelay: `${index * 100}ms` }}
              className="w-full text-left animate-in slide-in-from-bottom-4 fade-in fill-mode-both bg-white rounded-[2.2rem] p-4 border-2 border-transparent hover:border-cartoon-purple active:scale-[0.96] shadow-lg shadow-gray-200/50 flex items-center gap-4 transition-all group"
            >
              <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden bg-gray-50 flex-shrink-0 border-2 border-gray-50 shadow-inner">
                <img src={offer.image || ""} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                    <div className="px-2 py-0.5 bg-cartoon-green/10 rounded-md">
                        <span className="text-cartoon-green font-black text-[8px] uppercase tracking-tighter">Fast Verify</span>
                    </div>
                </div>
                <h3 className="font-black text-gray-800 text-[17px] uppercase leading-none truncate mb-1">
                    {offer.title}
                </h3>
                <p className="text-gray-400 text-[10px] font-bold truncate italic opacity-80">{offer.description}</p>
              </div>
              <div className="bg-gray-50 text-gray-300 group-hover:bg-cartoon-purple group-hover:text-white w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all">
                <ChevronRight size={24} strokeWidth={4} />
              </div>
            </button>
          ))}
        </div>

        <footer className="text-center pt-6 pb-4 opacity-40">
            <p className="text-gray-400 text-[8px] font-black uppercase tracking-[0.3em]">
              CloudShield Secured © 2026 • Node: {userCity}
            </p>
        </footer>
      </div>

      {/* TASK MODAL */}
      {selectedOffer && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-[3.5rem] p-8 pb-10 shadow-2xl relative animate-in slide-in-from-bottom-10">
            <button 
                onClick={() => setSelectedOffer(null)} 
                className="absolute right-6 top-6 w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 active:scale-90 transition-transform"
            >
              <X size={20} strokeWidth={3} />
            </button>
            
            <div className="w-24 h-24 rounded-[2rem] overflow-hidden mx-auto mb-5 border-[4px] border-cartoon-yellow shadow-xl rotate-3 bg-cartoon-cream">
              <img src={selectedOffer.image || ""} alt="" className="w-full h-full object-cover" />
            </div>

            <h3 className="text-gray-800 text-2xl font-black mb-2 uppercase font-cartoon text-center leading-tight">
              {selectedOffer.title}
            </h3>
            <p className="text-gray-400 font-bold text-xs mb-8 text-center px-4 leading-relaxed">
              {selectedOffer.description}
            </p>

            <button 
              onClick={() => window.open(selectedOffer.url, "_blank")}
              className="w-full py-5 bg-cartoon-purple text-white font-black text-xl rounded-[1.8rem] shadow-[0_8px_0_#4c1d95] active:shadow-none active:translate-y-2 transition-all uppercase font-cartoon flex items-center justify-center gap-3 animate-button-pulse"
            >
              <Fingerprint size={24} />
              {i18n.completeOfferBtn}
            </button>
          </div>
        </div>
      )}

      {/* TUTORIAL VIDEO MODAL */}
      {showTutorial && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-md aspect-[9/16] max-h-[85vh] bg-black rounded-[3rem] overflow-hidden relative border-4 border-white/10 shadow-2xl">
            
            {/* Loading Overlay */}
            {videoLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black">
                <Loader2 size={40} className="text-cartoon-purple animate-spin mb-4" />
                <p className="text-white/40 font-black text-[10px] uppercase tracking-widest">Optimizing Video...</p>
              </div>
            )}

            {/* Header */}
            <div className="absolute top-0 inset-x-0 p-6 bg-gradient-to-b from-black/90 to-transparent z-30 flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-white font-black text-lg uppercase tracking-tight leading-none">Unlock Guide</h3>
                <p className="text-cartoon-green text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">Live Playback</p>
              </div>
              <button 
                onClick={() => setShowTutorial(false)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all active:scale-90"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Video Player */}
            <div className="w-full h-full bg-black flex items-center justify-center">
              <video 
                src="/how-to-complete-tasks.MOV"
                className="w-full h-full object-cover"
                autoPlay 
                controls
                playsInline
                onCanPlayThrough={() => setVideoLoading(false)} // HIDE LOADING WHEN READY
                onEnded={() => setShowTutorial(false)} // AUTO BACK LOGIC
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes button-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .animate-button-pulse {
          animation: button-pulse 2s infinite ease-in-out;
        }
        .font-cartoon { font-family: 'var(--font-cartoon)', system-ui, sans-serif; }
      `}</style>
    </div>
  );
}