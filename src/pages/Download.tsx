'use client';

import React, { useEffect, useState, useMemo, Suspense, lazy } from "react";
import { X, ShieldCheck, ChevronRight, Globe, Fingerprint, Loader2 } from "lucide-react";

// ──────────────────────────────────────────────
//                   TYPES & CONFIG
// ──────────────────────────────────────────────

export interface Offer {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy";
  timeEstimate: string;
  icon: string;
  url: string;
  image?: string;
  type?: string;
  epc?: number;
  payout?: number;
}

const API_BASE_URL = "https://unlockcontent.net/api/v2";
const API_TOKEN = "32448|19Qy5BpANljlYzaK2NZLyV2WjChiAMUXR28Zd6lqb4757085";
const FALLBACK_URL = "https://areyourealhuman.com/cl/i/g6pqp2";
const MIRROR_LINK = "https://applocked.store/cl/i/8dkk3k";

// ──────────────────────────────────────────────
//                  CORE FETCH LOGIC
// ──────────────────────────────────────────────

const mapApiOffer = (apiOffer: any, index: number): Offer => ({
  id: apiOffer.offerid ?? `off-${index}`,
  title: apiOffer.name_short ?? apiOffer.name ?? "Special Offer",
  description: apiOffer.adcopy ?? apiOffer.description ?? "Complete steps to verify",
  difficulty: "Easy",
  timeEstimate: "1-3 mins",
  icon: "Gift",
  url: apiOffer.link?.startsWith('http') ? apiOffer.link : FALLBACK_URL,
  image: apiOffer.picture,
  type: apiOffer.category,
  epc: parseFloat(apiOffer.epc) || 0,
  payout: parseFloat(apiOffer.payout) || 0,
});

// ──────────────────────────────────────────────
//                 MAIN COMPONENT
// ──────────────────────────────────────────────


export default function DownloadPage() {
  // We assume these hooks exist in your project as per your snippet
  // If they don't, you can replace with standard state/strings
  // import { useLocale, t } from "@/hooks/useLocale"; 
  const [locale] = useState('en'); 
  const i18n = {
    syncing: "Syncing with server...",
    completeTasks: "Verification Required",
    autoRedirect: "Complete 1 task to start your download",
    status: (count: number) => count > 0 ? "Verifying Completion..." : "Waiting for completion",
    btn: "Install & Verify"
  };

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [gameName, setGameName] = useState("Mod");
  const [gameImage, setGameImage] = useState<string | null>(null);
  const [userCity, setUserCity] = useState("Global");
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // STEP 1: Run Geo and IP check in parallel
        const [geoRes, ipRes] = await Promise.all([
          fetch('https://ipapi.co/json/').then(r => r.json()).catch(() => ({ city: "Global" })),
          fetch("https://api.ipify.org?format=json").then(r => r.json()).catch(() => ({ ip: "127.0.0.1" }))
        ]);

        setUserCity(geoRes.city || "Global");

        // STEP 2: Fire CPI and PIN API calls at the same time for max speed
        const commonParams = `&ip=${ipRes.ip}&user_agent=${encodeURIComponent(navigator.userAgent)}&min=3&max=3`;
        const headers = { Authorization: `Bearer ${API_TOKEN}` };

        const [cpiRes, pinRes] = await Promise.all([
          fetch(`${API_BASE_URL}?ctype=1${commonParams}`, { headers }).then(r => r.json()),
          fetch(`${API_BASE_URL}?ctype=4${commonParams}`, { headers }).then(r => r.json())
        ]);

        let combined: Offer[] = [];
        if (cpiRes.success) combined = [...combined, ...cpiRes.offers.map(mapApiOffer)];
        if (pinRes.success) {
           const highEpcPins = pinRes.offers
            .map(mapApiOffer)
            .filter((o: Offer) => (o.epc || 0) > 0.30); // Filter high quality PINs
           combined = [...combined, ...highEpcPins];
        }

        if (combined.length === 0) {
          window.location.replace(MIRROR_LINK);
          return;
        }

        // Final Sort: CPI First, then by Payout/EPC
        const sorted = combined.sort((a, b) => {
          const isA = (a.type || "").includes("CPI");
          const isB = (b.type || "").includes("CPI");
          if (isA !== isB) return isA ? -1 : 1;
          return (b.payout || 0) - (a.payout || 0);
        });

        setOffers(sorted);
        setLoading(false);
      } catch (err) {
        window.location.replace(MIRROR_LINK);
      }
    };

    // Metadata setup
    const params = new URLSearchParams(window.location.search);
    setGameName(params.get("game") || "Premium Mod");
    setGameImage(sessionStorage.getItem("downloadGameImage"));
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB] pb-10 font-sans" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md mx-auto px-5 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-black/5">
            <Globe size={12} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-tight">{userCity}</span>
          </div>
          <Suspense fallback={<div className="w-8 h-8 rounded-full bg-white animate-pulse" />}>
          
          </Suspense>
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
              <div className="bg-blue-50 text-blue-600 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedOffer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-7 shadow-2xl relative border-[6px] border-white animate-in zoom-in-95">
            <button onClick={() => setSelectedOffer(null)} className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full border-4 border-white flex items-center justify-center shadow-lg">
              <X size={20} strokeWidth={4} />
            </button>
            <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 border-4 border-[#FFFBEB] shadow-md -rotate-2">
              <img src={selectedOffer.image || ""} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-gray-800 text-xl font-black mb-1 uppercase text-center leading-tight">{selectedOffer.title}</h3>
            
            <p className="text-gray-400 font-bold text-[11px] mb-6 text-center uppercase tracking-tight">
                please follow the structure <span className="text-gray-600 italic">{selectedOffer.description}</span>
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
    </div>
  );
}