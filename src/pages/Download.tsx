// // 'use client';

// // import React, { memo, useState } from "react";

// // /* ────────────────────── FULLSCREEN IFRAME WITH REAL LOADING INDICATOR ────────────────────── */
// // const IframeWithLoading = memo(() => {
// //   const [loaded, setLoaded] = useState(false);

// //   return (
// //     <div className="fixed inset-0 z-50 bg-white flex flex-col">
// //       {/* Subtle Professional Loading Overlay - disappears when iframe loads */}
// //       {!loaded && (
// //         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-white">
// //           <div className="professional-loader"></div>
// //         </div>
// //       )}

// //       {/* Real iframe */}
// //       <iframe
// //         src="https://appinstallcheck.com/cl/i/8dkk3k"
// //         title="Content"
// //         className="flex-1 w-full relative z-10"
// //         allowFullScreen
// //         sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation"
// //         loading="lazy"
// //         referrerPolicy="no-referrer"
// //         onLoad={() => setLoaded(true)}  // Hide loader when iframe actually finishes loading
// //       />
// //     </div>
// //   );
// // });

// // /* ────────────────────── STYLES WITH PROFESSIONAL SUBTLE LOADING EFFECT ────────────────────── */
// // const SimpleStyles = () => (
// //   <style>{`
// //     /* Professional subtle loading spinner */
// //     .professional-loader {
// //       width: 60px;
// //       height: 60px;
// //       border: 4px solid rgba(59, 130, 246, 0.2);
// //       border-top: 4px solid #3b82f6;
// //       border-radius: 50%;
// //       animation: spin 1s linear infinite;
// //       opacity: 0.8;
// //     }

// //     @keyframes spin {
// //       0% { transform: rotate(0deg); }
// //       100% { transform: rotate(360deg); }
// //     }

// //     /* Soft pulse glow */
// //     .professional-loader::before {
// //       content: '';
// //       position: absolute;
// //       inset: -10px;
// //       border-radius: 50%;
// //       background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
// //       animation: pulse 2s ease-in-out infinite;
// //     }

// //     @keyframes pulse {
// //       0%, 100% { opacity: 0.3; transform: scale(1); }
// //       50% { opacity: 0.6; transform: scale(1.1); }
// //     }
// //   `}</style>
// // );

// // /* ────────────────────── MAIN COMPONENT ────────────────────── */
// // const Download = () => {
// //   return (
// //     <>
// //       <SimpleStyles />
// //       <IframeWithLoading />
// //     </>
// //   );
// // };

// // export default Download;
// 'use client';

// import React, { useEffect, useState } from "react";
// import { X, ShieldCheck, ChevronRight, Star, Globe } from "lucide-react";
// import { fetchOffers, type Offer } from "@/services/offerService";
// import { useLocale, t } from "@/hooks/useLocale";

// /* ────────────────────── PRO STYLES ────────────────────── */
// const GlobalStyles = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
//     body { background-color: #00a2ff; font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; }
//     .no-select { user-select: none; -webkit-user-select: none; }
//     .glass-dark { background: rgba(15, 23, 42, 0.98); backdrop-filter: blur(15px); }
//     @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//     .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
//   `}</style>
// );

// /* ────────────────────── DARK PREMIUM MODAL ────────────────────── */
// const OfferModal = ({ offer, onClose, btnText }: { offer: Offer; onClose: () => void; btnText: string }) => (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
//     <div className="relative w-full max-w-[340px] glass-dark rounded-[2.5rem] p-8 shadow-2xl border border-white/10 text-center">
//       <button onClick={onClose} className="absolute right-5 top-5 text-gray-500 hover:text-white transition-colors">
//         <X size={28} strokeWidth={3} />
//       </button>

//       <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 border-2 border-white/10 shadow-lg">
//         <img src={offer.image || ""} alt="" className="w-full h-full object-cover" />
//       </div>
      
//       <h3 className="text-white text-xl font-black mb-2 tracking-tight">{offer.title}</h3>
      
//       <div className="flex justify-center gap-1 mb-6">
//         {[...Array(5)].map((_, i) => (
//           <Star key={i} size={14} className={i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-700 text-gray-700"} />
//         ))}
//       </div>

//       <p className="text-gray-400 text-sm font-semibold leading-relaxed mb-8 px-2">
//         {offer.description}
//       </p>

//       <button 
//         onClick={() => window.open(offer.url, "_blank")}
//         className="w-full py-4 bg-gradient-to-r from-emerald-400 to-cyan-500 text-white font-black text-lg rounded-2xl shadow-[0_5px_0_#065f46] active:translate-y-1 active:shadow-none transition-all"
//       >
//         {btnText}
//       </button>
//     </div>
//   </div>
// );

// export default function DownloadPage() {
//   const [locale] = useLocale();
//   const i18n = t(locale);
  
//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
//   const [showServer2, setShowServer2] = useState(false);
//   const [gameName, setGameName] = useState("Mod");

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     setGameName(params.get("game") || "Premium Mod");

//     const loadData = async () => {
//       try {
//         const data = await fetchOffers();
//         // If no offers exist, immediately flip to Server 2
//         if (!data || data.length === 0) {
//           setShowServer2(true);
//         } else {
//           const top2 = [...data].sort((a, b) => b.payout - a.payout).slice(0, 2);
//           setOffers(top2);
//         }
//       } catch (error) {
//         setShowServer2(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Full screen loading spinner
//   if (loading) {
//     return (
//       <div className="fixed inset-0 bg-[#00a2ff] flex items-center justify-center">
//         <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
//       </div>
//     );
//   }

//   // Server 2 View (No close button allowed)
//   if (showServer2) {
//     return (
//       <div className="fixed inset-0 z-[200] bg-white flex flex-col">
//         <div className="p-4 bg-blue-700 text-white flex justify-between items-center font-bold">
//           <span className="uppercase text-xs tracking-widest">Secure Server Connection</span>
//           <ShieldCheck size={20}/>
//         </div>
//         <iframe 
//           src="https://appinstallcheck.com/cl/i/8dkk3k" 
//           className="flex-1 w-full border-none" 
//           title="Verification"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-5 no-select flex flex-col items-center" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
//       <GlobalStyles />
//       <main className="w-full max-w-md">
        
//         {/* MAIN INSTRUCTION BOX */}
//         <section className="bg-white rounded-[2.5rem] p-8 mb-6 text-center border-[6px] border-yellow-300 shadow-2xl animate-fadeIn">
//           <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full mb-5 border border-blue-100">
//             <ShieldCheck size={16} strokeWidth={3} className="animate-pulse" />
//             <span className="text-[10px] font-black uppercase tracking-widest">Verification Required</span>
//           </div>
          
//           <h1 className="text-2xl font-black text-gray-800 leading-[1.1] mb-3">
//             {i18n.completeOneTask}
//           </h1>
          
//           <p className="text-gray-500 font-bold text-sm px-2">
//             {i18n.gameReady.replace("{game}", gameName)}
//           </p>
//         </section>

//         {/* STATUS BAR */}
//         <div className="w-full bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-3xl p-5 mb-8 shadow-xl border-b-4 border-black/10 flex items-center justify-center gap-4 animate-fadeIn">
//           <div className="w-7 h-7 rounded-full border-4 border-white/30 border-t-white animate-spin" />
//           <span className="text-white font-bold text-xs uppercase tracking-wide">
//             Verification:
//             <span className="mx-1 font-extrabold text-yellow-300">0</span>
//             /
//             <span className="mx-1 font-extrabold text-yellow-300">1</span>
//             Steps Done
//           </span>
//         </div>

//         {/* TASK LIST */}
//         <div className="space-y-4">
//           {offers.map((offer, index) => (
//             <div 
//               key={offer.id}
//               onClick={() => setSelectedOffer(offer)}
//               className="group bg-white rounded-[2rem] p-4 border-b-[6px] border-black/10 flex items-center gap-4 cursor-pointer active:translate-y-1 active:border-b-0 transition-all"
//             >
//               <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
//                 <img src={offer.image || ""} alt="" className="w-full h-full object-cover" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
//                     Step {index + 1}
//                   </span>
//                   <div className="flex">
//                     {[...Array(5)].map((_, i) => <Star key={i} size={8} className="fill-yellow-400 text-yellow-400" />)}
//                   </div>
//                 </div>
//                 <h3 className="font-black text-gray-800 text-lg truncate leading-tight">
//                   {offer.title}
//                 </h3>
//               </div>
//               <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
//                 <ChevronRight size={24} strokeWidth={4} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* TRY SERVER 2 - Hidden if first server (offers) is working */}
//         {offers.length === 0 && (
//           <button 
//             onClick={() => setShowServer2(true)}
//             className="w-full mt-10 py-4 flex items-center justify-center gap-2 text-white/50 hover:text-white font-black text-xs uppercase tracking-widest transition-all"
//           >
//             <Globe size={14} />
//             {i18n.tryServer2}
//           </button>
//         )}

//         {selectedOffer && (
//           <OfferModal 
//             offer={selectedOffer} 
//             onClose={() => setSelectedOffer(null)} 
//             btnText={i18n.completeOfferBtn}
//           />
//         )}
//       </main>
//     </div>
//   );
// }
'use client';

import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { X, ShieldCheck, ChevronRight, Star, Globe, Zap } from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";

const LangPicker = lazy(() => import("./LangPicker"));

/* ────────────────────── ULTRA-FAST BRANDED SKELETON ────────────────────── */
const FastSkeleton = () => (
  <div className="w-full max-w-md animate-pulse space-y-6">
    <div className="flex justify-between items-center px-2">
      <div className="h-9 w-32 bg-cartoon-purple/10 rounded-full" />
      <div className="h-10 w-10 bg-cartoon-purple/10 rounded-full" />
    </div>
    <div className="h-48 bg-white rounded-[3rem] border-[6px] border-cartoon-yellow/10" />
    {/* Status Bar Skeleton */}
    <div className="h-20 bg-cartoon-green/20 rounded-[2rem]" />
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="h-24 bg-white/60 rounded-[2.5rem] border-4 border-white" />
      ))}
    </div>
  </div>
);

export default function DownloadPage() {
  const [locale] = useLocale();
  const i18n = useMemo(() => t(locale), [locale]);
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [gameName, setGameName] = useState("Mod");

  const MIRROR_LINK = "https://appinstallcheck.com/cl/i/8dkk3k";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setGameName(params.get("game") || "Premium Mod");

    const loadData = async () => {
      try {
        const data = await fetchOffers();
        // INSTANT REDIRECT IF EMPTY
        if (!data || data.length === 0) {
          window.location.replace(MIRROR_LINK);
          return;
        }
        setOffers(data.sort((a, b) => b.payout - a.payout).slice(0, 2));
        setLoading(false);
      } catch (error) {
        window.location.replace(MIRROR_LINK);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-cartoon-cream selection:bg-cartoon-purple/20" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      
      {loading ? (
        <FastSkeleton />
      ) : (
        <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          <header className="flex justify-between items-center mb-2">
            <div className="bg-white px-4 py-2 rounded-full border-2 border-cartoon-purple/10 flex items-center gap-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-cartoon-green animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure Server</span>
            </div>
            <Suspense fallback={<div className="w-10 h-10 rounded-full bg-gray-100" />}>
              <LangPicker />
            </Suspense>
          </header>

          <main className="space-y-6">
            {/* Title Section */}
            <section className="bg-white rounded-[3rem] p-8 text-center border-[6px] border-cartoon-yellow shadow-cartoon-purple relative">
              <div className="inline-flex items-center gap-2 bg-cartoon-purple/5 text-cartoon-purple px-4 py-1.5 rounded-full mb-4 border border-cartoon-purple/10">
                <ShieldCheck size={16} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase font-cartoon tracking-tight">Anti-Bot Shield</span>
              </div>
              <h1 className="text-3xl font-black text-gray-800 leading-[0.9] mb-4 uppercase font-cartoon">
                {i18n.completeOneTask}
              </h1>
              <p className="text-gray-400 font-bold text-sm">
                {i18n.gameReady.replace("{game}", gameName)}
              </p>
            </section>

            {/* NEW STATUS BAR WITH YOUR CUSTOM SPAN */}
            <div className="w-full bg-cartoon-green rounded-[2rem] p-5 shadow-cartoon-green border-b-4 border-black/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                 
                </div>
                <div className="flex flex-col">
                  <span className="text-white/60 font-black text-[9px] uppercase leading-none mb-1">Status</span>
                  <span className="text-white font-bold text-xs uppercase tracking-wide">
                    Verification:
                    <span className="mx-1 font-extrabold text-yellow-300">0</span>
                    /
                    <span className="mx-1 font-extrabold text-yellow-300">1</span>
                    Steps Done
                  </span>
                </div>
              </div>
            </div>

            {/* Offer List */}
            <div className="space-y-4">
              {offers.map((offer, index) => (
                <div 
                  key={offer.id}
                  onClick={() => setSelectedOffer(offer)}
                  className="group bg-white rounded-[2.5rem] p-4 border-[4px] border-transparent hover:border-cartoon-purple hover:-translate-y-1 shadow-cartoon-purple flex items-center gap-4 cursor-pointer transition-all active:scale-95"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-cartoon-cream flex-shrink-0 border-2 border-cartoon-yellow shadow-inner">
                    <img src={offer.image || ""} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-cartoon-pink font-black text-[10px] uppercase font-cartoon block mb-0.5">Step {index + 1}</span>
                    <h3 className="font-black text-gray-800 text-lg truncate uppercase font-cartoon leading-none">{offer.title}</h3>
                  </div>
                  <div className="bg-cartoon-purple text-white p-2 rounded-xl shadow-md group-hover:bg-cartoon-pink transition-colors">
                    <ChevronRight size={24} strokeWidth={4} />
                  </div>
                </div>
              ))}
            </div>

            {/* Mirror Link */}
            {/* <button 
              onClick={() => window.location.href = MIRROR_LINK}
              className="w-full py-4 flex items-center justify-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-cartoon-purple transition-all font-cartoon"
            >
              <Globe size={14} />
              {i18n.tryServer2}
            </button> */}
          </main>
        </div>
      )}

      {/* Premium Offer Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-150">
          <div className="relative w-full max-w-[340px] bg-white rounded-[3rem] p-8 shadow-2xl border-[5px] border-cartoon-purple text-center">
            <button onClick={() => setSelectedOffer(null)} className="absolute right-6 top-6 text-gray-400 hover:scale-110 transition-transform">
              <X size={28} strokeWidth={3} />
            </button>
            <div className="w-24 h-24 rounded-[2rem] overflow-hidden mx-auto mb-6 border-[4px] border-cartoon-yellow shadow-md rotate-3 bg-cartoon-cream">
              <img src={selectedOffer.image || ""} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-gray-800 text-xl font-black mb-2 uppercase font-cartoon">{selectedOffer.title}</h3>
            <p className="text-gray-500 font-bold text-sm mb-8 px-2 leading-tight opacity-70">{selectedOffer.description}</p>
            <button 
              onClick={() => window.open(selectedOffer.url, "_blank")}
              className="w-full py-4 bg-cartoon-purple text-white font-black text-lg rounded-2xl shadow-cartoon-purple hover:brightness-110 active:scale-95 transition-all uppercase font-cartoon"
            >
              {i18n.completeOfferBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}