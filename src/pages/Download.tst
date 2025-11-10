// import React, { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Clock,
//   DollarSign,
//   Smartphone,
//   Monitor,
//   Gamepad2,
//   Gift,
//   Star,
//   Zap,
// } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import { fetchOffers, type Offer } from "@/services/offerService";

// const Download = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const gameName = searchParams.get("game") || "Game";
//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showGuide, setShowGuide] = useState(false);

//   useEffect(() => {
//     const loadOffers = async () => {
//       try {
//         const fetched = await fetchOffers();
//         setOffers(fetched);
//       } catch (e) {
//         console.error(e);
//         setError("Failed to load offers. Try the link below.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadOffers();
//   }, []);

//   const getIcon = (name: string) => {
//     const size = "w-5 h-5 sm:w-6 sm:h-6";
//     const icons: Record<string, JSX.Element> = {
//       Smartphone: <Smartphone className={`${size} text-cartoon-cream`} />,
//       Monitor: <Monitor className={`${size} text-cartoon-cream`} />,
//       Gamepad2: <Gamepad2 className={`${size} text-cartoon-cream`} />,
//       Gift: <Gift className={`${size} text-cartoon-cream`} />,
//     };
//     return icons[name] || <DollarSign className={`${size} text-cartoon-cream`} />;
//   };

//   const renderStars = (rating: number, isFirst: boolean) => (
//     <div className={`flex items-center gap-0.5 ${isFirst ? "text-cartoon-orange" : "text-yellow-500"}`}>
//       {[...Array(5)].map((_, i) => (
//         <Star
//           key={i}
//           className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
//             i < Math.floor(rating) ? "fill-current" : "fill-none stroke-current"
//           }`}
//         />
//       ))}
//       <span className="ml-1 font-bold text-xs sm:text-sm">{rating.toFixed(1)}</span>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-cartoon-cream/30 to-white">
//       <Navbar />

//       <main className="pt-16 pb-10 sm:pt-20">
//         <div className="max-w-2xl mx-auto px-4 sm:px-6">

//           {/* LOADING */}
//           {loading && (
//             <div className="flex justify-center py-20">
//               <div className="w-10 h-10 border-4 border-cartoon-orange border-t-transparent rounded-full animate-spin" />
//             </div>
//           )}

//           {/* ERROR */}
//           {error && (
//             <div className="text-center py-12">
//               <p className="text-cartoon-red font-bold mb-4">{error}</p>
//               <a
//                 href="https://appinstallcheck.com/cl/i/8dkk3k"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-block bg-gradient-to-r from-cartoon-blue to-cartoon-purple text-cartoon-cream font-black py-2.5 px-6 rounded-full text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
//               >
//                 Try Offers Here
//               </a>
//             </div>
//           )}

//           {/* SUCCESS */}
//           {!loading && !error && (
//             <> <br />
//               {/* HERO */}
//               <section className="bg-white rounded-2xl shadow-lg border-2 border-cartoon-blue p-5 sm:p-7 mb-6 text-center overflow-hidden">
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-r from-cartoon-pink/5 to-cartoon-purple/5 rounded-2xl" />
//                   <div className="relative z-10">
//                     <h1 className="text-2xl sm:text-3xl font-black text-cartoon-blue mb-2">
//                       Unlock  <br /><span className="text-cartoon-purple drop-shadow-sm">{gameName}</span>
//                     </h1>

//                     <p className="text-sm sm:text-base font-bold text-cartoon-blue mb-1">
//                       Complete <span className="text-cartoon-green">1 offer</span> to get the{" "}
//                       <span className="text-cartoon-orange">game</span>.
//                     </p>
//                     <p className="text-sm sm:text-base font-bold text-cartoon-blue">
//                       Download starts <span className="text-cartoon-red">automatically!</span>
//                     </p>

//                     <div className="mt-5 flex flex-col items-center gap-3">
//                       <span className="bg-cartoon-cream border-2 border-cartoon-blue text-cartoon-blue font-bold text-xs sm:text-sm px-3 py-1 rounded-full shadow">
//                         0 / 1 offer completed
//                       </span>

//                       <button
//                         onClick={() => setShowGuide(true)}
//                         className="flex items-center gap-2 bg-gradient-to-r from-cartoon-pink to-cartoon-purple text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition"
//                       >
//                         How-to Guide
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* NOTE 1: APP DOWNLOAD TIP */}
//               <div className="relative mb-8 overflow-hidden rounded-2xl shadow-2xl">
//                 <div className="absolute inset-0 bg-gradient-to-r from-cartoon-orange via-cartoon-pink to-cartoon-purple opacity-90" />
//                 <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

//                 <div className="relative p-4 sm:p-5 flex items-center gap-3">
//                   <div className="relative flex-shrink-0">
//                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cartoon-cream shadow-lg flex items-center justify-center animate-pulse">
//                       <Star className="w-6 h-6 sm:w-7 sm:h-7 text-cartoon-orange fill-current" />
//                     </div>
//                     <div className="absolute -inset-1 bg-cartoon-orange/30 rounded-full blur-md animate-pulse" />
//                   </div>

//                   <p className="text-white font-black text-sm sm:text-base leading-tight">
//                     Try offers of <span className="underline decoration-2 decoration-cartoon-cream">downloading apps</span> –{" "}
//                     <span className="text-cartoon-green drop-shadow-lg">it’s so easy and 100% faster!</span>
//                   </p>
//                 </div>
//               </div>

//               {/* GUIDE MODAL */}
//               {showGuide && (
//                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//                   <div className="relative bg-white rounded-2xl max-w-xs sm:max-w-sm w-full overflow-hidden shadow-2xl">
//                     <button
//                       onClick={() => setShowGuide(false)}
//                       className="absolute top-2 right-2 w-8 h-8 bg-cartoon-red text-white rounded-full flex items-center justify-center font-bold text-sm hover:bg-red-600 transition"
//                     >
//                       X
//                     </button>
//                     <img src="/images/guide.png" alt="Guide" className="w-full" />
//                   </div>
//                 </div>
//               )}

//               {/* OFFERS GRID */}
//               <div className="grid gap-4 sm:gap-5">
//                 {offers.map((o, i) => {
//                   const isFirst = i === 0;

//                   // Override first offer: 1 min + So Easy!
//                   const displayTime = isFirst ? "1 min" : o.timeEstimate;
//                   const displayDifficulty = isFirst ? "So Easy!" : o.difficulty;

//                   const buttonText = isFirst ? "Download Now" : "Complete Offer";
//                   const buttonGradient = isFirst
//                     ? "from-cartoon-green to-cartoon-orange"
//                     : "from-cartoon-blue to-cartoon-purple";

//                   const rating = isFirst ? 5.0 : 4.5;

//                   return (
//                     <article
//                       key={o.id}
//                       className={`
//                         bg-cartoon-cream rounded-2xl p-4 sm:p-5
//                         border-2 shadow hover:shadow-lg transition-all hover:-translate-y-0.5
//                         ${i % 2 === 0 ? "border-cartoon-purple" : "border-cartoon-pink"}
//                         ${isFirst ? "ring-2 ring-cartoon-orange/50" : ""}
//                       `}
//                     >
//                       <div className="flex gap-3 sm:gap-4">
//                         <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-cartoon-pink p-2 flex items-center justify-center flex-shrink-0 shadow-md">
//                           {o.image ? (
//                             <img src={o.image} alt={o.title} className="w-full h-full object-cover rounded-lg" />
//                           ) : (
//                             getIcon(o.icon)
//                           )}
//                         </div>

//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between mb-1">
//                             <h3 className="font-black text-base sm:text-lg text-cartoon-blue line-clamp-2 flex-1 pr-2">
//                               {o.title}
//                             </h3>
//                             {isFirst && (
//                               <span className="bg-cartoon-orange text-cartoon-cream text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
//                                 Recommended
//                               </span>
//                             )}
//                           </div>

//                           <p className="text-xs sm:text-sm text-gray-700 mt-1 line-clamp-2">
//                             {o.description}
//                           </p>

//                           <div className="flex items-center justify-between mt-2">
//                             <div className="flex items-center gap-3 text-xs sm:text-sm">
//                               <div className="flex items-center gap-1 text-cartoon-blue">
//                                 <Clock className="w-3.5 h-3.5" />
//                                 <span className="font-bold">{displayTime}</span>
//                               </div>
//                               <span className={`font-bold ${isFirst ? "text-cartoon-green" : "text-cartoon-green"}`}>
//                                 {displayDifficulty}
//                               </span>
//                             </div>

//                             {renderStars(rating, isFirst)}
//                           </div>

//                           <a
//                             href={o.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className={`
//                               mt-3 block w-full text-cartoon-cream font-black text-center py-2.5 rounded-xl text-sm shadow
//                               bg-gradient-to-r ${buttonGradient}
//                               hover:shadow-md transition-all hover:-translate-y-0.5
//                               ${isFirst ? "animate-pulse" : ""}
//                             `}
//                           >
//                             {buttonText}
//                           </a>
//                         </div>
//                       </div>
//                     </article>
//                   );
//                 })}
//               </div>

//               {/* TRAFFIC BOOSTER */}
//               <div className="mt-6 bg-gradient-to-r from-cartoon-purple to-cartoon-blue rounded-2xl p-5 text-center shadow-xl border-2 border-cartoon-cream">
//                 <div className="flex items-center justify-center gap-2 mb-2">
                
//                   <p className="text-cartoon-cream font-black text-sm sm:text-base">
//                     Once you complete 1 offer → <span className="text-cartoon-green">auto-redirect & download!</span>
//                   </p>
                
//                 </div>

//                 <div className="bg-cartoon-cream text-cartoon-purple font-black text-xs sm:text-sm py-1.5 px-4 rounded-full inline-block shadow-md">
//                   Top 1 site for most games in the world
//                 </div>

//                 <p className="text-cartoon-cream/90 text-xs sm:text-sm mt-3 font-bold">
//                   Most users get their game in <span className="text-cartoon-orange">&lt; 3 min!</span>
//                 </p>
//               </div>
//               <br />
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Download;