import React, { useEffect, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  AlertCircle,
  CheckCircle2,
  Star,
  ShieldCheck,
  Info,
  ExternalLink
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

import { fetchGameBySlug, type Game } from "@/services/gameService";
import { fetchOffers, type Offer } from "@/services/offerService";

/* ──────────────────────────────────────────────────────────────
   SKELETON COMPONENT (NEO-BRUTALIST STYLE)
   ────────────────────────────────────────────────────────────── */
const BeautifulSkeleton = () => (
  <div className="animate-pulse space-y-12">
    <div className="text-center space-y-4">
      <div className="h-16 bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-3/4 mx-auto" />
      <div className="h-10 bg-white/50 border-4 border-black shadow-[4px_4px_0px_#000] w-1/2 mx-auto" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5 space-y-6">
        <div className="aspect-square bg-white border-4 border-black shadow-[12px_12px_0px_#000]" />
      </div>
      <div className="lg:col-span-7">
        <div className="h-[450px] bg-[#FDF4E3] border-4 border-black shadow-[15px_15px_0px_#000]" />
      </div>
    </div>
  </div>
);

const GameDetail = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCaptcha, setShowCaptcha] = useState(false);
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isFetchingOffers, setIsFetchingOffers] = useState(false);

  // REDIRECT URL
  const FALLBACK_URL = "https://applocked.store/cl/i/8dkk3k";

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
        setTimeout(() => setLoading(false), 800);
      }
    };
    loadGame();
  }, [slug]);

  useEffect(() => {
    document.body.style.overflow = showCaptcha ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [showCaptcha]);

  const handleStartDownload = async () => {
    setShowCaptcha(true);
    setIsFetchingOffers(true);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6D33', '#FF80BF', '#FFEB3B']
    });

    try {
      const data = await fetchOffers();
      if (data && data.length > 0) {
        setOffers(data);
      } else {
        // Redirect if no offers found
        window.location.href = FALLBACK_URL;
      }
    } catch (err) {
      console.error("Offer Fetch Error", err);
      // Redirect on error
      window.location.href = FALLBACK_URL;
    } finally {
      setIsFetchingOffers(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FF80BF] font-sans selection:bg-[#FFEB3B] selection:text-black">
      <Helmet>
        <title>{game ? `${game.title} Mod 2026 | Safe Download` : "Loading Mod..."}</title>
      </Helmet>

      {/* Header */}
      <div className="bg-[#FFEB3B] h-14 w-full relative overflow-hidden border-b-4 border-black">
        <svg className="absolute bottom-[-1px] w-full h-10 text-[#FF80BF] fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-12 flex items-center gap-2 bg-white border-[3px] border-black px-5 py-2 font-black text-sm shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase"
        >
          <ArrowLeft size={20} strokeWidth={4} /> Back to mods
        </button>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BeautifulSkeleton />
            </motion.div>
          ) : !game ? (
            <motion.div key="error" className="text-center py-20 bg-white border-4 border-black shadow-[12px_12px_0px_#000]">
              <AlertCircle className="w-20 h-20 mx-auto mb-4 text-red-500" />
              <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter">Mod not found!</h2>
              <button onClick={() => navigate("/")} className="bg-[#4ADE80] border-4 border-black px-8 py-3 font-black shadow-[6px_6px_0px_#000]">RETURN HOME</button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              
              <div className="text-center relative">
                <div className="absolute -top-12 right-0 md:right-10 bg-[#B088F9] border-[3px] border-black px-6 py-2 font-black text-white text-xl transform rotate-12 shadow-[6px_6px_0px_#000] z-10 hidden md:block uppercase">SOLVED</div>
                <h1 className="text-5xl md:text-8xl font-black text-black leading-[0.9] tracking-tighter uppercase mb-6">
                  High pricing <span className="text-white">problem?</span> <br /> We hear you!
                </h1>
                <p className="text-xl md:text-2xl font-bold text-black max-w-3xl mx-auto leading-tight italic">
                  Why pay for {game.title} features? Our mod provides UNLIMITED access and premium unlocks for $0.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white border-4 border-black p-4 shadow-[12px_12px_0px_#000]">
                    <img src={game.image_url} alt={game.title} className="w-full aspect-square object-cover border-4 border-black mb-6" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FFEB3B] border-2 border-black rounded-full flex items-center justify-center font-black">?</div>
                      <p className="font-bold text-sm italic">"I was hitting limits daily until I found this mod. Absolute joy to use!"</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#4ADE80] border-4 border-black p-4 shadow-[6px_6px_0px_#000] text-center">
                      <p className="font-black text-xs uppercase opacity-70">Rating</p>
                      <div className="flex justify-center items-center gap-1 font-black text-2xl italic"><Star fill="black" size={20}/> {game.rating}</div>
                    </div>
                    <div className="bg-[#818CF8] border-4 border-black p-4 shadow-[6px_6px_0px_#000] text-center text-white">
                      <p className="font-black text-xs uppercase opacity-50">Version</p>
                      <p className="font-black text-2xl italic">v{game.version}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="bg-[#FDF4E3] border-[4px] border-black p-8 md:p-12 shadow-[20px_20px_0px_#000] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4"><ShieldCheck size={40} className="opacity-20" /></div>
                    <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter underline decoration-[#FF80BF] decoration-8 underline-offset-4">Mod Features Unlocked</h2>
                    <div className="mb-8 border-l-8 border-[#FF6D33] pl-6 py-2">
                      <p className="text-lg md:text-xl font-bold text-black leading-snug italic">"{game.description}"</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 mb-12">
                      {game.features?.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 font-black text-lg uppercase tracking-tight">
                          <CheckCircle2 className="text-green-600" size={24} strokeWidth={4} /> {feature}
                        </div>
                      ))}
                    </div>

                    {!showCaptcha && (
                      <button
                        onClick={handleStartDownload}
                        className="w-full bg-[#FF6D33] text-white border-[2px] border-black py-4 font-black text-xl shadow-[5px_5px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 group uppercase"
                      >
                        <Download size={24} strokeWidth={4} className="group-hover:animate-bounce" /> START DOWNLOAD
                      </button>
                    )}

                    {/* COMPACT FULL SCREEN VERIFICATION BOX */}
                    <AnimatePresence>
                      {showCaptcha && (
                        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white border-[6px] border-black w-full max-w-md shadow-[15px_15px_0px_#000] flex flex-col overflow-hidden"
                          >
                            <div className="bg-[#FFEB3B] border-b-4 border-black p-4 text-center">
                              <h3 className="font-black text-2xl uppercase italic leading-none">Security Check</h3>
                              <p className="text-[10px] font-bold uppercase mt-1 opacity-70">complete only 1 of the offers to start your download</p>
                            </div>

                            <div className="p-4 space-y-4 bg-gray-50 max-h-[70vh] overflow-y-auto">
                              {isFetchingOffers ? (
                                <div className="py-12 text-center space-y-4">
                                  <div className="w-10 h-10 border-4 border-black border-t-[#FF6D33] rounded-full animate-spin mx-auto" />
                                  <p className="font-black text-xs uppercase animate-pulse">Syncing Connection...</p>
                                </div>
                              ) : offers.map((offer) => (
                                <div key={offer.id} className="bg-white border-[3px] border-black p-3 shadow-[4px_4px_0px_#000] flex flex-col gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-black border-2 border-black flex-shrink-0">
                                      <img src={offer.image} alt="app" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-black text-sm uppercase truncate leading-tight">{offer.title}</h4>
                                      <span className="text-[9px] font-black bg-red-600 text-white px-2 py-0.5 uppercase">Action Required</span>
                                    </div>
                                  </div>

                                  <p className="text-[11px] font-bold text-gray-600 leading-tight border-l-2 border-black/10 pl-2">
                                    {offer.description}
                                  </p>

                                  <a 
                                    href={offer.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#4ADE80] border-[2px] border-black py-2 font-black text-sm text-center shadow-[3px_3px_0px_#000] hover:shadow-none transition-all uppercase flex items-center justify-center gap-2"
                                  >
                                    CLICK HERE <ExternalLink size={14} strokeWidth={3} />
                                  </a>
                                </div>
                              ))}
                            </div>

                            <div className="bg-white border-t-4 border-black p-2 text-center">
                              <p className="text-[9px] font-black uppercase opacity-40">User ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>

                    <div className="mt-10 flex flex-wrap gap-6 justify-center border-t-4 border-black pt-8">
                       <span className="flex items-center gap-2 font-black text-xs uppercase bg-white px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000]">
                         <div className="w-3 h-3 bg-green-500 border border-black rounded-full" /> Full Unlocks
                       </span>
                       <span className="flex items-center gap-2 font-black text-xs uppercase bg-white px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000]">
                         <div className="w-3 h-3 bg-green-500 border border-black rounded-full" /> No Root
                       </span>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default GameDetail;