// 'use client';

// import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
// import { X, ShieldCheck, ChevronRight, Globe, Fingerprint, PlayCircle, Loader2 } from "lucide-react";
// import { fetchOffers, type Offer } from "@/services/offerService";
// import { useLocale, t } from "@/hooks/useLocale";

// const LangPicker = lazy(() => import("./LangPicker"));

// export default function DownloadPage() {
//   const [locale] = useLocale();
//   const i18n = useMemo(() => t(locale), [locale]);
  
//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
//   const [showTutorial, setShowTutorial] = useState(false);
//   const [videoLoading, setVideoLoading] = useState(true);
//   const [gameName, setGameName] = useState("Mod");
//   const [gameImage, setGameImage] = useState<string | null>(null);
//   const [userCity, setUserCity] = useState("Global");
//   const [completedCount, setCompletedCount] = useState(0);

//   const MIRROR_LINK = "https://applocked.store/cl/i/8dkk3k";

//   useEffect(() => {
//     const fetchGeo = async () => {
//       try {
//         const response = await fetch('https://ipapi.co/json/');
//         const data = await response.json();
//         setUserCity(data.city || "Nearby");
//       } catch (err) { setUserCity("Global"); }
//     };
//     fetchGeo();

//     const params = new URLSearchParams(window.location.search);
//     setGameName(params.get("game") || "Premium Mod");
//     setGameImage(sessionStorage.getItem("downloadGameImage"));

//     const loadData = async () => {
//       try {
//         const data = await fetchOffers();
//         if (!data?.length) { window.location.replace(MIRROR_LINK); return; }
//         setOffers(data.sort((a, b) => b.payout - a.payout));
//         setLoading(false);
//       } catch (error) { window.location.replace(MIRROR_LINK); }
//     };
//     loadData();
//   }, []);

//   if (loading) return <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

//   return (
//     <div className="min-h-screen bg-[#FFFBEB] pb-10 font-sans" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
//       <div className="w-full max-w-md mx-auto px-5 pt-4 space-y-5">
        
//         {/* HEADER */}
//         <header className="flex justify-between items-center">
//           <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-black/5">
//             <Globe size={12} className="text-blue-500" />
//             <span className="text-[10px] font-black uppercase text-gray-500 tracking-tight">{userCity}</span>
//           </div>
//           <Suspense fallback={<div className="w-8 h-8 rounded-full bg-white animate-pulse" />}><LangPicker /></Suspense>
//         </header>

//         {/* STICKER CARD */}
//         <section className="bg-[#FFFDF0] rounded-[2.5rem] p-5 text-center border-[3px] border-[#FFEB3B] shadow-[0_8px_0_rgba(0,0,0,0.05)] relative overflow-hidden">
//           <div className="relative z-10 flex flex-col items-center gap-4">
//             <div className="flex items-center gap-3 w-full px-2">
//               <div className="relative shrink-0">
//                 <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
//                   <img src={gameImage || ""} alt="" className="w-full h-full object-cover" />
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 bg-[#00D68F] p-0.5 rounded-full border-2 border-white shadow-sm">
//                   <ShieldCheck size={12} className="text-white" strokeWidth={4} />
//                 </div>
//               </div>
//               <div className="text-left">
//                 <h2 className="text-[18px] font-black text-[#333] leading-none uppercase tracking-tight">{gameName}</h2>
//                 <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">{i18n.syncing}</p>
//               </div>
//             </div>
//             <div className="space-y-3 pt-3 border-t border-black/5 w-full">
//               <h1 className="text-[19px] font-black text-[#333] leading-tight px-2">{i18n.completeTasks}</h1>
//               <p className="text-[#333] font-bold text-[14px] leading-snug">{i18n.autoRedirect}</p>
//             </div>
//           </div>
//         </section>

//         {/* PROGRESS PILL */}
//         <div className="w-full bg-gradient-to-r from-[#00D27F] via-[#00C5CC] to-[#2E86FB] rounded-full py-3.5 px-6 border-2 border-black shadow-[0_4px_0_rgba(0,0,0,0.15)] flex items-center justify-center gap-3 relative overflow-hidden">
//           <div className="relative w-5 h-5 shrink-0">
//             <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
//             <div className="absolute inset-0 border-2 border-transparent border-t-yellow-300 rounded-full animate-spin"></div>
//           </div>
//           <span className="text-white font-black text-[15px] uppercase tracking-wide drop-shadow-md">
//             {i18n.status(completedCount)}
//           </span>
//           <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-full pointer-events-none"></div>
//         </div>

//         {/* TASK LIST */}
//         <div className="space-y-2.5">
//           {offers.map((offer) => (
//             <button key={offer.id} onClick={() => setSelectedOffer(offer)} className="w-full text-left bg-white rounded-[1.5rem] p-3 border-b-[4px] border-gray-200 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-3">
//               <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-black/5">
//                 <img src={offer.image || ""} alt="" className="w-full h-full object-cover" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-black text-gray-800 text-[15px] uppercase truncate leading-tight">{offer.title}</h3>
//                 <p className="text-gray-400 text-[10px] font-bold truncate uppercase tracking-tight">
//                     <span>{offer.description ? offer.description.substring(0, 35) + "..." : "Follow steps to verify"}</span>
//                 </p>
//               </div>
//               <div className="bg-blue-50 text-blue-600 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-blue-100"><ChevronRight size={20} /></div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* MODAL - STRUCTURE UPDATED */}
//       {selectedOffer && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
//           <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-7 shadow-2xl relative border-[6px] border-white animate-in zoom-in-95">
//             <button onClick={() => setSelectedOffer(null)} className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full border-4 border-white flex items-center justify-center shadow-lg"><X size={20} strokeWidth={4} /></button>
//             <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 border-4 border-[#FFFBEB] shadow-md -rotate-2">
//               <img src={selectedOffer.image || ""} alt="" className="w-full h-full object-cover" />
//             </div>
//             <h3 className="text-gray-800 text-xl font-black mb-1 uppercase text-center leading-tight">{selectedOffer.title}</h3>
            
//             {/* SPAN STRUCTURE UPDATED BELOW */}
//             <p className="text-gray-400 font-bold text-[11px] mb-6 text-center uppercase tracking-tight">
//                please follow the structure <span>{selectedOffer.description}</span>
//             </p>

//             <button 
//               onClick={() => { window.open(selectedOffer.url, "_blank"); setCompletedCount(1); setSelectedOffer(null); }}
//               className="w-full py-4 bg-blue-600 text-white font-black text-lg rounded-2xl shadow-[0_6px_0_#1e40af] active:shadow-none active:translate-y-1 transition-all uppercase flex items-center justify-center gap-2"
//             >
//               <Fingerprint size={20} />
//               {i18n.btn}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* TUTORIAL MODAL */}
//       {showTutorial && (
//         <div className="fixed inset-0 z-[800] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
//           <div className="w-full max-w-md aspect-[9/16] bg-black rounded-[3rem] overflow-hidden relative border-4 border-white/10 shadow-2xl">
//             <div className="absolute top-0 inset-x-0 p-6 z-30 flex justify-between items-start">
//               <h3 className="text-white font-black text-lg uppercase">Unlock Guide</h3>
//               <button onClick={() => setShowTutorial(false)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white"><X size={20} /></button>
//             </div>
//             <video src="/how-to-complete-tasks.MOV" className="w-full h-full object-cover" autoPlay controls onEnded={() => setShowTutorial(false)} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function DownloadPage() {
  const [loading, setLoading] = useState(true);
  const DIRECT_LINK = "https://applocked.store/cl/i/8dkk3k";

  useEffect(() => {
    // Prevent scrolling on the body to keep it feel like a native app
    document.body.style.overflow = 'hidden';
    
    // Safety timeout: if iframe fails to load, hide spinner after 5s
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#FFFBEB] overflow-hidden">
      
      {/* 3D CREAM LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFBEB]">
          {/* Soft 3D Glow Effect */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
            <Loader2 className="animate-spin text-blue-600 relative z-10" size={40} />
          </div>
          
          <p className="mt-4 font-black text-slate-400 uppercase text-[10px] tracking-[0.3em] animate-pulse">
            Loading ...
          </p>
        </div>
      )}

      {/* FULLSCREEN IFRAME */}
      <iframe 
        src={DIRECT_LINK}
        className={`w-full h-full border-none transition-opacity duration-1000 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        title="Content"
        // Standard permissions for lockers/offers
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={() => setLoading(false)}
      />

      {/* HIDDEN INLINE CSS TO RESET BROWSER DEFAULTS */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #FFFBEB;
        }
      `}</style>
    </div>
  );
}