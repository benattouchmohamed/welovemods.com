'use client';

import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { X, ShieldCheck, ChevronRight, Star, Globe, Lock, Fingerprint, Activity, ShieldPlus } from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";

const LangPicker = lazy(() => import("./LangPicker"));

export default function DownloadPage() {
  const [locale] = useLocale();
  const i18n = useMemo(() => t(locale), [locale]);
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [gameName, setGameName] = useState("Mod");
  const [gameImage, setGameImage] = useState<string | null>(null);
  
  const [userCity, setUserCity] = useState("Global");
  const [showToast, setShowToast] = useState(false);
  const [recentWinner, setRecentWinner] = useState({ name: "User741", city: "London" });
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase());
  
  // NEW: Progress Counter State
  const [progress, setProgress] = useState(0);

  const MIRROR_LINK = "https://appinstallcheck.com/cl/i/8dkk3k";

  // Progress animation effect
  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 50 ? prev + 1 : 50));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loading]);

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
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
      
      {/* MOBILE TOAST */}
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
            <div className="flex items-center gap-1.5 text-[8px] font-black text-cartoon-green uppercase bg-white px-2.5 py-1 rounded-full border-2 border-cartoon-green/10 w-fit">
              <Activity size={10} className="animate-pulse" />
              {i18n.secureConnection}
            </div>
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
            <div className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-400 px-3 py-1 rounded-full mb-4 border border-gray-100">
              <Lock size={10} strokeWidth={3} />
              <span className="text-[8px] font-black uppercase tracking-widest">SESSION ID: {sessionId}</span>
            </div>

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

        {/* TASK LIST */}
        <div className="space-y-3">
          {offers.map((offer, index) => (
            <button 
              key={offer.id}
              onClick={() => setSelectedOffer(offer)}
              style={{ animationDelay: `${index * 80}ms` }}
              className="w-full text-left animate-in slide-in-from-bottom-2 fade-in fill-mode-both bg-white rounded-[2rem] p-4 border-2 border-transparent active:border-cartoon-purple active:scale-[0.97] shadow-md flex items-center gap-4 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-cartoon-cream flex-shrink-0 border border-cartoon-yellow/20 shadow-sm">
                <img src={offer.image || ""} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                    <Star size={9} className="fill-cartoon-yellow text-cartoon-yellow" />
                    <span className="text-cartoon-green font-black text-[8px] uppercase tracking-wider">Trusted Offer</span>
                </div>
                <h3 className="font-black text-gray-800 text-[16px] uppercase font-cartoon leading-none truncate">
                    {offer.title}
                </h3>
              </div>
              <div className="bg-cartoon-purple text-white w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-active:translate-x-1 transition-transform">
                <ChevronRight size={22} strokeWidth={4} />
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

      {/* MODAL */}
      {selectedOffer && (
        <div className="fixed inset-0 z-[700] flex items-end sm:items-center justify-center p-4 bg-gray-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-t-[3.5rem] sm:rounded-[3.5rem] p-8 pb-10 shadow-2xl relative animate-in slide-in-from-bottom-10">
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

            {/* PULSING PRIMARY BUTTON */}
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