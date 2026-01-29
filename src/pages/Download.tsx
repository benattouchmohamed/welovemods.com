// 'use client';
// import React, { useEffect, useState, useMemo, lazy, Suspense, useRef } from "react";
// import {
//   ShieldCheck,
//   Fingerprint,
//   ChevronRight,
//   Zap,
//   Lock,
//   Star,
//   Loader2,
//   X,
// } from "lucide-react";
// import { fetchOffers, type Offer } from "@/services/offerService";
// import { useLocale, t } from "@/hooks/useLocale";
// import { motion, AnimatePresence, PanInfo } from "framer-motion";

// const LangPicker = lazy(() => import("./LangPicker"));

// export default function DownloadPage() {
//   const [locale] = useLocale();
//   const i18n = useMemo(() => t(locale), [locale]);

//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [gameName, setGameName] = useState("Mod");
//   const [gameImage, setGameImage] = useState<string | null>(null);
//   const [isVerified, setIsVerified] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [iframeUrl, setIframeUrl] = useState<string | null>(null);

//   const fallbackUrl = "https://applocked.store/cl/i/8dkk3k";
//   const hasAutoOpened = useRef(false); // prevent multiple auto-opens on re-renders

//   const onlineUsers = useMemo(() => Math.floor(Math.random() * 500) + 1200, []);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     setGameName(params.get("game") || "Premium Mod");
//     setGameImage(sessionStorage.getItem("downloadGameImage"));

//     let mounted = true;
//     const loadData = async () => {
//       try {
//         const data = await fetchOffers();
//         if (mounted) setOffers(data || []);
//       } finally {
//         if (mounted) setTimeout(() => setLoading(false), 800);
//       }
//     };
//     loadData();
//     return () => { mounted = false; };
//   }, []);

//   // Auto-open iframe when no offers are available (once)
//   useEffect(() => {
//     if (!loading && offers.length === 0 && !hasAutoOpened.current) {
//       setIframeUrl(fallbackUrl);
//       hasAutoOpened.current = true;
//     }
//   }, [loading, offers.length]);

//   useEffect(() => {
//     if (offers.length <= 1 || isPaused || isVerified) return;
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % offers.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [offers.length, isPaused, isVerified]);

//   const handleNext = () => setCurrentIndex((prev) => (prev + 1) % offers.length);
//   const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);

//   const openServer2 = () => setIframeUrl(fallbackUrl);
//   const closeIframe = () => setIframeUrl(null);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#FFFBEB] flex flex-col items-center justify-center gap-6 px-6">
//         <Loader2 className="w-14 h-14 text-blue-600 animate-spin" strokeWidth={2.5} />
//         <div className="text-center space-y-2">
//           <p className="text-slate-800 font-black text-lg uppercase tracking-wide">
//             Verifying you're not a bot...
//           </p>
//           <p className="text-slate-500 text-sm">Please wait a moment</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen bg-[#FFFBEB] pb-8 font-sans overflow-x-hidden"
//       dir={locale === "ar" ? "rtl" : "ltr"}
//     >
//       {/* ACTIVITY TICKER */}
//       <div className="bg-slate-900 text-white py-2 overflow-hidden whitespace-nowrap border-b border-slate-800">
//         <motion.div
//           animate={{ x: ["100%", "-100%"] }}
//           transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
//           className="flex gap-10 items-center text-[10px] font-black uppercase tracking-widest"
//         >
//           <span className="flex items-center gap-2">
//             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {onlineUsers} USERS ONLINE
//           </span>
//           <span className="text-amber-400">● New unlock: {gameName}</span>
//           <span>● System Status: Secure</span>
//         </motion.div>
//       </div>

//       <div className="w-full max-w-md mx-auto px-5 pt-5 pb-6 space-y-5">
//         <header className="flex justify-end">
//           <Suspense fallback={<div className="w-3 h-3" />}>
//             {/* <LangPicker /> */}
//           </Suspense>
//         </header>

//         <section className="rounded-[2.5rem] p-5 border-b-[8px] border-amber-400 shadow-2xl relative overflow-hidden border-2 border-slate-100 bg-white">
//           <div className="flex items-center gap-4 relative z-10">
//             <div className="relative shrink-0">
//               <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden border-4 border-[#FFFBEB] shadow-xl rotate-[-2deg]">
//                 <img src={gameImage || "/fallback-game.png"} alt={gameName} className="w-full h-full object-cover" />
//               </div>
//               <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-full border-4 border-white shadow-sm">
//                 <ShieldCheck size={14} className="text-white" strokeWidth={3} />
//               </div>
//             </div>
//             <div className="min-w-0">
//               <h1 className="text-2xl font-black text-slate-900 leading-none uppercase italic tracking-tighter truncate">
//                 {gameName}
//               </h1>
//               <div className="inline-flex items-center gap-1.5 mt-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
//                 <Lock size={10} />
//                 <span className="text-[9px] font-black uppercase tracking-widest">{i18n.syncing}</span>
//               </div>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t border-slate-50">
//             <h2 className="text-lg font-black text-slate-800 uppercase leading-tight tracking-tight">
//               {i18n.completeTasks}
//             </h2>
//             <p className="text-slate-500 font-bold text-xs uppercase mt-0.5 opacity-70">
//               {i18n.autoRedirect}
//             </p>
//           </div>
//         </section>

//         <div className="py-3.5 px-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_#000] flex items-center bg-white text-slate-900">
//           <div className="flex items-center gap-3">
//             <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
//             <span className="font-black text-[11px] uppercase tracking-wider italic">
//               Verifying Completion...
//             </span>
//           </div>
//         </div>

//         {offers.length > 0 ? (
//           <>
//             <div
//               className="relative px-1"
//               onMouseEnter={() => setIsPaused(true)}
//               onMouseLeave={() => setIsPaused(false)}
//             >
//               <div className="relative min-h-[240px]">
//                 <AnimatePresence mode="wait">
//                   {offers.map((offer, idx) =>
//                     idx === currentIndex ? (
//                       <OfferCard
//                         key={offer.id}
//                         offer={offer}
//                         i18n={i18n}
//                         onVerify={() => setIsVerified(true)}
//                         onNext={handleNext}
//                         onPrev={handlePrev}
//                       />
//                     ) : null
//                   )}
//                 </AnimatePresence>
//               </div>

//               {offers.length > 1 && (
//                 <div className="flex justify-center gap-1.5 mt-4">
//                   {offers.map((_, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => setCurrentIndex(idx)}
//                       className={`h-1.5 transition-all duration-300 rounded-full ${
//                         idx === currentIndex ? "w-6 bg-blue-600" : "w-1.5 bg-slate-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Server 2 button when offers exist */}
//          {/* <button
//   onClick={openServer2}
//   className="
//     w-full flex items-center justify-center gap-2 mt-5
//     text-blue-600 hover:text-green-700 active:text-green-800
//     text-sm uppercase tracking-wide
//     rounded-xl py-3 shadow-md active:translate-y-0.5 transition-all
//   "
// >
//   Server 2 <span className="text-xs font-medium"></span>
//   <ChevronRight size={16} strokeWidth={3} />
// </button> */}

//           </>
//         ) : (
//           // When no offers → only show a minimal message (iframe auto-opens above)
//           <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-slate-200 text-center">
//             <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight mb-3">
//               No offers available
//             </h3>
//             <p className="text-slate-600">
//               Opening alternative verification server...
//             </p>
//             <button
//               onClick={openServer2}
//               className="
//                 w-full flex items-center justify-center gap-2 mt-5
//                 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
//                 text-white font-black text-sm uppercase tracking-widest
//                 rounded-xl py-4 shadow-lg active:translate-y-0.5 transition-all
//               "
//             >
              
//                Server 2
//               <ChevronRight size={16} strokeWidth={3} />
//             </button>
//           </div>
//         )}

//         <footer className="text-center pt-3">
//           <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] italic opacity-40">
//             Validated Cloud Protocol v.2.0.4
//           </p>
//         </footer>
//       </div>

//       {/* FULLSCREEN IFRAME OVERLAY */}
//       <AnimatePresence>
//         {iframeUrl && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             className="fixed inset-0 z-[100] bg-white flex flex-col"
//           >
  
//             <div className="flex-1 relative bg-slate-50">
//               <div className="absolute inset-0 flex items-center justify-center -z-10">
//                 <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//               </div>
//               <iframe
//                 src={iframeUrl}
//                 className="w-full h-full border-none relative z-10"
//                 title="Verification Portal"
//                 sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
//                 allowFullScreen
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// function OfferCard({
//   offer,
//   i18n,
//   onVerify,
//   onNext,
//   onPrev,
// }: {
//   offer: Offer;
//   i18n: any;
//   onVerify: () => void;
//   onNext: () => void;
//   onPrev: () => void;
// }) {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const description = offer.description || "Follow internal steps to verify device and unlock link instantly.";
//   const isLongText = description.length > 90;

//   // Handle swipe completion
//   const handleDragEnd = (event: any, info: PanInfo) => {
//     const swipeThreshold = 100;
//     if (info.offset.x < -swipeThreshold) {
//       onNext(); // Swiped left -> next
//     } else if (info.offset.x > swipeThreshold) {
//       onPrev(); // Swiped right -> prev
//     }
//   };

//   return (
//     <motion.div
//       drag="x"
//       dragConstraints={{ left: 0, right: 0 }}
//       dragElastic={0.7}
//       onDragEnd={handleDragEnd}
//       initial={{ x: 100, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: -100, opacity: 0 }}
//       transition={{ type: "spring", stiffness: 300, damping: 30 }}
//       className="
//         absolute inset-0
//         bg-white rounded-[2rem]
//         p-4 pt-5
//         shadow-2xl border-2 border-blue-500/10
//         flex flex-col gap-3
//         touch-none cursor-grab active:cursor-grabbing
//       "
//     >
//       {/* Pulse border effect */}
//       <div className="absolute inset-0 rounded-[2rem] border-2 border-blue-500/20 animate-pulse pointer-events-none" />

//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
//           <img 
//             src={offer.image || "/fallback-offer.png"} 
//             alt={offer.title} 
//             className="w-full h-full object-cover" 
//             draggable={false}
//           />
//         </div>
//         <div className="flex-1 min-w-0">
//           <h3 className="font-black text-slate-900 uppercase text-sm leading-tight truncate">
//             {offer.title}
//           </h3>
          
//           <div className="flex items-center gap-0.5 mt-1">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 size={14}
//                 className="text-yellow-500 fill-yellow-400 drop-shadow-sm"
//                 strokeWidth={2.5}
//               />
//             ))}
//           </div>

//           <div className="flex items-center gap-1 mt-0.5">
//             <Zap size={9} className="fill-blue-500 text-blue-500" />
//             <span className="text-[8px] font-black text-blue-600 uppercase italic">High Success Rate</span>
//           </div>
//         </div>
//       </div>

//       {/* Description */}
//       <div className="relative flex-grow-0">
//         <div
//           className={`text-slate-700 font-bold text-[11px] leading-snug uppercase tracking-tight ${
//             isExpanded ? "max-h-[110px] overflow-y-auto pr-1" : "line-clamp-4"
//           }`}
//         >
//           {description}
//         </div>

//         {isLongText && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsExpanded(!isExpanded);
//             }}
//             className="text-blue-600 text-[10px] font-black mt-1.5 uppercase underline decoration-2 underline-offset-2"
//           >
//             {isExpanded ? "Show Less" : "Show More..."}
//           </button>
//         )}
//       </div>

//       {/* Action Button */}
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           window.open(offer.url, "_blank", "noopener,noreferrer");
//           setTimeout(onVerify, 2500);
//         }}
//         className="
//           mt-auto
//           w-full flex items-center justify-center gap-2
//           bg-blue-600 hover:bg-blue-700 active:bg-blue-800
//           text-white font-black text-sm uppercase tracking-widest
//           rounded-xl py-3.5
//           shadow-lg active:translate-y-0.5 transition-all
//           z-20
//         "
//       >
//         <Fingerprint size={17} />
//         {i18n.btn || "INSTALL & VERIFY"}
//         <ChevronRight size={15} strokeWidth={3} />
//       </button>
//     </motion.div>
//   );
// }
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
      
      
      {/* <div className="bg-white border-b border-slate-100 py-3 px-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{onlineUsers} ACTIVE </span>
        </div> */}
       
      {/* </div> */}

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