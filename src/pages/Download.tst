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


// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { ArrowLeft, Download, Box, Folder, Settings } from "lucide-react";
// import { Helmet } from "react-helmet-async";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// import { fetchGameBySlug, Game } from "@/services/gameService";
// import { Card, CardContent } from "@/components/ui/card";
// import RatingStars from "@/components/RatingStars";
// import { useNavigate } from "react-router-dom";

// const GameDetail = () => {
//   const { slug } = useParams();
//   const [game, setGame] = useState<Game | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadGame = async () => {
//       if (!slug) return;
//       try {
//         const gameData = await fetchGameBySlug(slug);
//         setGame(gameData);
//       } catch (error) {
//         console.error("Failed to fetch game:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadGame();
//   }, [slug]);

//   const handleDownload = () => {
//     if (!game) return;
//     setIsDownloading(true);
//     setTimeout(() => {
//       navigate(`/Download?game=${encodeURIComponent(game.title)}`);
//     }, 800);
//   };

//   const tagColors: Record<string, { base: string; dark: string; text?: string }> = {
//     MOD: { base: "bg-green-600", dark: "dark:bg-green-500", text: "text-white" },
//     PREMIUM: { base: "bg-purple-600", dark: "dark:bg-purple-500", text: "text-white" },
//     NEW: {
//       base: "bg-white border border-blue-600 text-blue-600",
//       dark: "dark:bg-blue-950 dark:border-blue-500 dark:text-blue-400",
//     },
//     HOT: { base: "bg-red-600", dark: "dark:bg-red-500", text: "text-white" },
//   };

//   // === SKELETON LOADING COMPONENT ===
//   const LoadingSkeleton = () => (
//     <div className="min-h-screen bg-gradient-to-br from-cartoon-cream/20 via-white to-cartoon-blue/10 animate-pulse">
//       <Navbar />
//       <main className="pt-20 pb-6">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Left: Image + Button */}
//             <div className="lg:col-span-1">
//               <div className="bg-cartoon-cream/50 border-4 border-cartoon-blue/30 rounded-3xl p-4 shadow-lg">
//                 <div className="bg-gray-300 border-2 border-dashed rounded-2xl w-full h-64 animate-pulse" />
//                 <div className="mt-6 h-14 bg-gradient-to-r from-cartoon-green/20 to-cartoon-blue/20 rounded-2xl animate-pulse" />
//               </div>
//             </div>

//             {/* Right: Details */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Title Card */}
//               <div className="bg-cartoon-cream/50 border-4 border-cartoon-pink/30 rounded-3xl p-6">
//                 <div className="h-10 bg-gray-300 rounded-full w-3/4 mb-4 animate-pulse" />
//                 <div className="h-6 bg-gray-300 rounded-full w-1/2 mb-6 animate-pulse" />
//                 <div className="space-y-3">
//                   <div className="h-4 bg-gray-300 rounded-full w-full animate-pulse" />
//                   <div className="h-4 bg-gray-300 rounded-full w-5/6 animate-pulse" />
//                   <div className="h-4 bg-gray-300 rounded-full w-4/6 animate-pulse" />
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="bg-yellow-100/50 border-2 border-yellow-300/50 rounded-2xl p-4">
//                   <div className="h-12 bg-yellow-200 rounded-xl w-12 animate-pulse" />
//                   <div className="mt-2 h-4 bg-gray-300 rounded-full w-20 animate-pulse" />
//                   <div className="mt-1 h-6 bg-gray-300 rounded-full w-16 animate-pulse" />
//                 </div>
//                 <div className="bg-pink-100/50 border-2 border-pink-300/50 rounded-2xl p-4">
//                   <div className="h-12 bg-pink-200 rounded-xl w-12 animate-pulse" />
//                   <div className="mt-2 h-4 bg-gray-300 rounded-full w-20 animate-pulse" />
//                   <div className="mt-1 h-6 bg-gray-300 rounded-full w-16 animate-pulse" />
//                 </div>
//               </div>

//               {/* Features */}
//               <div className="bg-cartoon-cream/50 border-4 border-cartoon-green/30 rounded-3xl p-6">
//                 <div className="h-8 bg-gray-300 rounded-full w-40 mb-4 animate-pulse" />
//                 <div className="space-y-3">
//                   {[...Array(4)].map((_, i) => (
//                     <div key={i} className="flex items-center gap-3">
//                       <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
//                       <div className="h-4 bg-gray-300 rounded-full flex-1 animate-pulse" />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* CTA */}
//               <div className="bg-gradient-to-r from-cartoon-red/20 to-cartoon-pink/20 border-4 border-cartoon-red/30 rounded-3xl p-6 text-center">
//                 <div className="h-8 bg-gray-300 rounded-full w-48 mx-auto mb-3 animate-pulse" />
//                 <div className="h-5 bg-gray-300 rounded-full w-64 mx-auto mb-5 animate-pulse" />
//                 <div className="h-12 bg-white/50 rounded-full w-56 mx-auto animate-pulse" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <Helmet>
//         {loading ? (
//           <>
//             <title>Loading Game... | AppsMod</title>
//             <meta name="description" content="Loading game information..." />
//           </>
//         ) : !game ? (
//           <>
//             <title>Game Not Found | AppsMod</title>
//             <meta name="description" content="Game not found. Browse our mods!" />
//           </>
//         ) : (
//           <>
//             <title>{game.title} Mod APK 2025 - Unlimited Coins & Cheats | AppsMod</title>
//             <meta
//               name="description"
//               content={`Download ${game.title} Mod APK 2025 with unlimited coins, unlocked features. Safe & free at welovemods.com.`}
//             />
//             <meta
//               name="keywords"
//               content={`${game.title} mod, cheats 2025, unlimited coins, Android mods, AppsMod, welovemods.com`}
//             />
//             <meta property="og:title" content={`${game.title} Mod APK 2025`} />
//             <meta property="og:image" content={game.image_url} />
//             <meta name="twitter:card" content="summary_large_image" />
//             <link rel="canonical" href={`https://welovemods.com/game/${slug}`} />
//           </>
//         )}
//       </Helmet>

//       <Navbar />

//       {/* === SHOW SKELETON WHILE LOADING === */}
//       {loading ? (
//         <LoadingSkeleton />
//       ) : !game ? (
//         /* === NOT FOUND === */
//         <main className="pt-20 pb-6">
//           <div className="container mx-auto px-4 text-center">
//             <h1 className="text-5xl font-black text-cartoon-red mb-6">Game Not Found!</h1>
//             <Button
//               className="bg-cartoon-blue hover:bg-cartoon-blue/90 text-white font-black shadow-base rounded-full px-8 py-6 text-lg flex items-center mx-auto"
//               onClick={() => navigate("/")}
//             >
//               <ArrowLeft className="w-6 h-6 mr-3" />
//               Back to Games
//             </Button>
//           </div>
//         </main>
//       ) : (
//         /* === GAME LOADED === */
//         <main className="pt-20 pb-6">
//           <div className="container mx-auto px-4 max-w-4xl">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Left: Image & Download */}
//               <div className="lg:col-span-1">
//                 <div className="bg-cartoon-cream border-4 border-cartoon-blue rounded-3xl p-4 shadow-blue">
//                   <img
//                     src={game.image_url || "/placeholder.svg"}
//                     alt={game.title}
//                     className="w-full aspect-square object-cover rounded-2xl shadow-soft"
//                   />
//                   <button
//                     className="w-full mt-6 bg-gradient-to-r from-cartoon-green to-cartoon-blue text-white font-black text-lg py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 flex items-center justify-center gap-2"
//                     onClick={handleDownload}
//                     disabled={isDownloading}
//                   >
//                     {isDownloading ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         Downloading...
//                       </>
//                     ) : (
//                       <>
//                         <Download className="w-6 h-6" />
//                         DOWNLOAD NOW!
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Right: Details */}
//               <div className="lg:col-span-2 space-y-6">
//                 <div className="bg-cartoon-cream border-4 border-cartoon-pink rounded-3xl p-6 shadow-pink">
//                   <h1 className="text-3xl lg:text-4xl font-black text-cartoon-red mb-4 leading-tight">
//                     {game.title}
//                   </h1>
//                   <div className="flex items-center gap-4 mb-4">
//                     <RatingStars rating={game.rating} />
//                     <span className="text-xl font-black text-cartoon-blue">{game.rating}/5</span>
//                   </div>
//                   <p className="text-gray-700 text-lg leading-relaxed">{game.description}</p>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="bg-yellow-200 border-2 border-yellow-400 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
//                     <div className="flex items-center gap-3">
//                       <div className="bg-yellow-400 p-3 rounded-xl">
//                         <Download className="w-6 h-6 text-white" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-bold text-yellow-700">Downloads</div>
//                         <div className="text-xl font-black text-gray-800">
//                           {game.downloads.toLocaleString()}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-pink-200 border-2 border-pink-400 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
//                     <div className="flex items-center gap-3">
//                       <div className="bg-pink-400 p-3 rounded-xl">
//                         <Box className="w-6 h-6 text-white" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-bold text-pink-700">Version</div>
//                         <div className="text-xl font-black text-gray-800">{game.version}</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {game.features && game.features.length > 0 && (
//                   <div className="bg-cartoon-cream border-4 border-cartoon-green rounded-3xl p-6 shadow-green">
//                     <h3 className="text-2xl font-black text-cartoon-green mb-4">MOD Features</h3>
//                     <ul className="space-y-3">
//                       {game.features.map((feature, i) => (
//                         <li key={i} className="flex items-center gap-3 text-gray-700">
//                           <div className="w-3 h-3 bg-cartoon-green rounded-full animate-pulse"></div>
//                           <span className="font-medium text-lg">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 <div className="bg-gradient-to-r from-cartoon-red to-cartoon-pink border-4 border-cartoon-red rounded-3xl p-6 shadow-red text-center">
//                   <h3 className="text-2xl font-black text-white mb-2">Ready to Play?</h3>
//                   <p className="text-white/90 font-bold mb-4">
//                     Join thousands of players enjoying this amazing game!
//                   </p>
//                   <button
//                     className="bg-white text-cartoon-red font-black px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-lg"
//                     onClick={handleDownload}
//                     disabled={isDownloading}
//                   >
//                     {isDownloading ? "Preparing..." : "Download & Install Now!"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main> 
//       )}<br /> <br />
//     </div>
//   );
// };

// export default GameDetail;


// /* Download.tsx – MULTI-COUNTRY NOTIFICATIONS + MOROCCO PRIORITY */
// import React, { useEffect, useState, useRef, memo, lazy, Suspense } from "react";
// import { useSearchParams } from "react-router-dom";
// import {
//   Clock, DollarSign, Smartphone, Monitor, Gamepad2, Gift, Star, Users, Flag,
// } from "lucide-react";
// import ReactCountryFlag from "react-country-flag";
// import { fetchOffers, type Offer } from "@/services/offerService";
// import { useLocale, t } from "@/hooks/useLocale";

// /* ──────────────────────  AUTO-COPY SCRIPT (Ctrl+C)  ────────────────────── */
// const AutoCopyScript = () => {
//   const { locale } = useLocale();
//   const time = new Date().toLocaleString("en-GB", { timeZone: "Africa/Casablanca" });

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.ctrlKey && e.key === "c") {
//         const text = `Copied from Download Page – ${time} (Morocco)`;
//         navigator.clipboard.writeText(text).then(() => {
//           const toast = document.createElement("div");
//           toast.textContent = "Copied!";
//           toast.style.cssText = `
//             position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
//             background:#10b981;color:white;padding:0.5rem 1rem;border-radius:9999px;
//             font-size:0.75rem;font-weight:bold;z-index:50;box-shadow:0 4px 6px rgba(0,0,0,0.1);
//             animation:bounce 0.6s
//           `.replace(/\s+/g, " ");
//           document.body.appendChild(toast);
//           setTimeout(() => toast.remove(), 2000);
//         });
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [time]);

//   return null;
// };

// /* ──────────────────────  NO SELECT WHILE SCROLLING  ────────────────────── */
// const NoSelectStyle = () => (
//   <style jsx global>{`
//     .no-select-while-scrolling * { user-select: none !important; }
//     .no-select-while-scrolling.selectable * { user-select: auto !important; }
//     @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
//   `}</style>
// );

// /* Lazy-load */
// const LangPicker = lazy(() => import("./LangPicker"));
// const SupportNote = lazy(() => import("./SupportNote"));

// /* ──────────────────────  SKELETON COMPONENTS  ────────────────────── */
// const HeaderSkeleton = () => (
//   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 animate-pulse">
//     <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
//     <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4" />
//     <div className="flex justify-center gap-3">
//       <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-full" />
//       <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded-lg" />
//     </div>
//   </div>
// );

// const OfferSkeleton = () => (
//   <div className="bg-white dark:bg-gray-800 rounded-xl p-3.5 border-2 border-gray-200 dark:border-gray-700 animate-pulse">
//     <div className="flex gap-3">
//       <div className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-gray-700 flex-shrink-0" />
//       <div className="flex-1">
//         <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
//         <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-1" />
//         <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-5/6 mb-3" />
//         <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg" />
//       </div>
//     </div>
//   </div>
// );

// const TipBannerSkeleton = () => (
//   <div className="relative mb-6 overflow-hidden rounded-xl shadow-lg h-12 animate-pulse">
//     <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 opacity-90" />
//   </div>
// );

// /* ──────────────────────  OFFER CARD  ────────────────────── */
// const OfferCard = memo(({ o, i, i18n }: { o: Offer; i: number; i18n: any }) => {
//   const isRecommended = i < 2;
//   const iconMap: Record<string, JSX.Element> = {
//     Smartphone: <Smartphone className="w-5 h-5 text-cartoon-cream" />,
//     Monitor: <Monitor className="w-5 h-5 text-cartoon-cream" />,
//     Gamepad2: <Gamepad2 className="w-5 h-5 text-cartoon-cream" />,
//     Gift: <Gift className="w-5 h-5 text-cartoon-cream" />,
//   };

//   return (
//     <article
//       className={`
//         bg-white dark:bg-gray-800 rounded-xl p-3.5 border-2 shadow hover:shadow-md transition-all
//         ${i % 2 === 0 ? "border-cartoon-purple" : "border-cartoon-pink"}
//         ${isRecommended ? "ring-2 ring-cartoon-orange/40" : ""}
//       `}
//     >
//       <div className="flex gap-3">
//         <div className="w-12 h-12 rounded-lg bg-cartoon-pink dark:bg-cartoon-pink/20 p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm">
//           {o.image ? (
//             <img src={o.image} alt={o.title} className="w-full h-full object-cover rounded" loading="lazy" />
//           ) : (
//             iconMap[o.icon] || <DollarSign className="w-5 h-5 text-cartoon-cream" />
//           )}
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between mb-1">
//             <h3 className="font-black text-sm text-cartoon-blue dark:text-cartoon-blue line-clamp-2 pr-1">
//               {o.title}
//             </h3>
//             {isRecommended && (
//               <span className="bg-cartoon-orange text-cartoon-cream text-[10px] font-bold px-1.5 py-0.5 rounded-full">
//                 {i18n.recommended}
//               </span>
//             )}
//           </div>
//           <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{o.description}</p>
//           <div className="flex items-center justify-between mt-2 text-xs">
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-1 text-cartoon-blue">
//                 <Clock className="w-3 h-3" />
//                 <span className="font-bold">{o.timeEstimate}</span>
//               </div>
//               <span className="font-bold text-cartoon-green">{o.difficulty}</span>
//             </div>
//             <div className={`flex items-center gap-0.5 ${isRecommended ? "text-cartoon-orange" : "text-yellow-500 dark:text-yellow-400"}`}>
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className="w-3 h-3 fill-current" />
//               ))}
//             </div>
//           </div>
//           <a
//             href={o.url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="mt-2.5 block w-full text-center py-2 rounded-lg text-xs font-black text-cartoon-cream bg-gradient-to-r from-cartoon-blue to-cartoon-purple shadow hover:shadow-md transition"
//           >
//             {i18n.completeOfferBtn}
//           </a>
//         </div>
//       </div>
//     </article>
//   );
// });

// /* ──────────────────────  FAKE USERS ONLINE  ────────────────────── */
// const FakeUsersOnline = () => {
//   const [count, setCount] = useState(23);
//   const i18n = t(useLocale()[0]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCount(prev => Math.max(23, Math.min(49, prev + Math.floor(Math.random() * 7) - 3)));
//     }, 3000 + Math.random() * 2000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex items-center gap-1.5 text-xs font-bold text-cartoon-blue dark:text-cartoon-blue">
//       <Users className="w-4 h-4" />
//       <span>{count}</span>
//       <span className="text-cartoon-purple">{i18n.usersOnline}</span>
//     </div>
//   );
// };

// /* ──────────────────────  TOP NOTIFICATION BAR  ────────────────────── */
// /* ──────────────────────  TOP NOTIFICATION BAR – 21 COUNTRIES + MOROCCO BOOST  ────────────────────── */
// interface Notification {
//   id: number;
//   country: string;
//   flag: string;
//   timeAgo: string;
// }

// const TopNotificationBar = ({ gameName }: { gameName: string }) => {
//   const [notifs, setNotifs] = useState<Notification[]>([]);
//   const idRef = useRef(0);
//   const [locale] = useLocale();
//   const i18n = t(locale);

//   const countries = [
//     // Top 20 by 2025 population + Morocco (boosted)
//     { code: "IN", name: "India", weight: 18 },
//     { code: "CN", name: "China", weight: 18 },
//     { code: "US", name: "USA", weight: 4 },
//     { code: "ID", name: "Indonesia", weight: 3 },
//     { code: "PK", name: "Pakistan", weight: 3 },
//     { code: "NG", name: "Nigeria", weight: 3 },
//     { code: "BR", name: "Brazil", weight: 2 },
//     { code: "BD", name: "Bangladesh", weight: 2 },
//     { code: "RU", name: "Russia", weight: 2 },
//     { code: "ET", name: "Ethiopia", weight: 2 },
//     { code: "MX", name: "Mexico", weight: 2 },
//     { code: "JP", name: "Japan", weight: 1 },
//     { code: "PH", name: "Philippines", weight: 1 },
//     { code: "EG", name: "Egypt", weight: 1 },
//     { code: "VN", name: "Vietnam", weight: 1 },
//     { code: "DR", name: "DR Congo", weight: 1 },
//     { code: "TR", name: "Turkey", weight: 1 },
//     { code: "IR", name: "Iran", weight: 1 },
//     { code: "DE", name: "Germany", weight: 1 },
//     { code: "TH", name: "Thailand", weight: 1 },
//     // Morocco Priority Boost
//     { code: "MA", name: "Morocco", weight: 6 },
//   ];

//   const weightedList = countries.flatMap(c => Array(c.weight).fill(c));

//   const randomCountry = () => weightedList[Math.floor(Math.random() * weightedList.length)];
//   const randomTime = () => {
//     const secs = Math.floor(Math.random() * 180) + 10;
//     return secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}min`;
//   };

//   useEffect(() => {
//     const showNext = () => {
//       const { name, code } = randomCountry();
//       const notif: Notification = {
//         id: ++idRef.current,
//         country: name,
//         flag: code,
//         timeAgo: randomTime(),
//       };
//       setNotifs([notif]);
//     };

//     showNext();
//     const interval = setInterval(showNext, 6000 + Math.random() * 2000);
//     return () => clearInterval(interval);
//   }, [gameName]);

//   return (
//     <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-cartoon-blue to-cartoon-purple shadow-lg">
//       <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-center gap-2 overflow-hidden">
//         {notifs.map(n => (
//           <div
//             key={n.id}
//             className="flex items-center gap-2 text-white animate-slideIn opacity-0 text-xs font-black"
//             style={{ animation: "slideIn 0.6s ease-out forwards, fadeOut 0.6s ease-out 5.4s forwards" }}
//           >
//             <ReactCountryFlag countryCode={n.flag} svg style={{ width: 22, height: 22, borderRadius: "50%" }} />
//             <span>
//               {i18n.playerFrom} <span className="underline">{n.country}</span> {i18n.unlocked}{" "}
//               <span className="text-cartoon-cream">{gameName}</span>{" "}
//               <span className="text-cartoon-green">download successfully</span>
//             </span>
//             <span className="text-[10px] ml-auto opacity-80">{n.timeAgo} ago</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// const TopNotificationStyles = () => (
//   <style jsx global>{`
//     @keyframes slideIn {
//       from { transform: translateY(-20px); opacity: 0; }
//       to { transform: translateY(0); opacity: 1; }
//     }
//     @keyframes fadeOut {
//       to { opacity: 0; transform: translateY(-10px); }
//     }
//   `}</style>
// );

// /* ──────────────────────  CONFIRM EXIT  ────────────────────── */
// const useConfirmExit = () => {
//   const [locale] = useLocale();
//   const i18n = t(locale);

//   useEffect(() => {
//     const handler = (e: BeforeUnloadEvent) => {
//       e.preventDefault();
//       e.returnValue = i18n.confirmExit || "Are you sure?";
//       return i18n.confirmExit;
//     };
//     window.addEventListener("beforeunload", handler);
//     return () => window.removeEventListener("beforeunload", handler);
//   }, [i18n.confirmExit]);
// };

// /* ──────────────────────  TRY SERVER 2  ────────────────────── */

// const TryServer2Button = () => {
//   const i18n = t(useLocale()[0]);

//   return (
//     <a
//       href="https://appinstallcheck.com/cl/i/8dkk3k"
//       target="_blank"
//       rel="noopener noreferrer"
//       className="
//         mt-3 w-full flex items-center justify-center
//         bg-gradient-to-r from-green-500 to-green-600
//         text-white font-semibold
//         rounded-lg shadow-md
//         py-2 px-4
//         transition-transform transform
//         active:scale-95
//         hover:scale-105 hover:shadow-lg
//       "
//     >
//       {i18n.tryServer2 || "Try server 2 (if this doesn't work)"}
//     </a>
//   );
// };


// /* ──────────────────────  MAIN PAGE  ────────────────────── */
// const Download = () => {
//   const [searchParams] = useSearchParams();
//   const gameName = searchParams.get("game") || "Game";
//   const [locale] = useLocale();
//   const i18n = t(locale);
//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showGuide, setShowGuide] = useState(false);
//   const [isScrolling, setIsScrolling] = useState(false);

//   useConfirmExit();

//   // Scroll handler
//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     const handleScroll = () => {
//       setIsScrolling(true);
//       clearTimeout(timer);
//       timer = setTimeout(() => setIsScrolling(false), 150);
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       clearTimeout(timer);
//     };
//   }, []);

//   // Fetch offers
//   useEffect(() => {
//     let mounted = true;
//     fetchOffers()
//       .then(fetched => {
//         if (mounted) {
//           setOffers(fetched);
//           setLoading(false);
//         }
//       })
//       .catch(() => {
//         if (mounted) {
//           setError(i18n.error);
//           setLoading(false);
//         }
//       });
//     return () => { mounted = false; };
//   }, [i18n.error]);

//   return (
//     <>
//       <AutoCopyScript />
//       <NoSelectStyle />
//       <TopNotificationStyles />

//       <div
//         dir={locale === "ar" ? "rtl" : "ltr"}
//         className={`min-h-screen bg-gradient-to-b from-cartoon-cream/30 to-white dark:from-gray-900 dark:to-gray-800 transition-colors
//           ${isScrolling ? "no-select-while-scrolling" : "no-select-while-scrolling selectable"}`}
//       >
//         <TopNotificationBar gameName={gameName} />

//         <main className="pt-16 pb-10 sm:pt-20">
//           <div className="max-w-xl mx-auto px-4 sm:px-6">
//             <div className="flex justify-center mb-4">
//               <FakeUsersOnline />
//             </div>

//             {/* Loading State */}
//             {loading && (
//               <div className="space-y-4">
//                 <HeaderSkeleton />
//                 <TipBannerSkeleton />
//                 <OfferSkeleton />
//                 <OfferSkeleton />
//                 <OfferSkeleton />
//               </div>
//             )}

//             {/* Error State */}
//             {error && !loading && (
//               <div className="text-center py-12 space-y-4">
//                 <p className="text-cartoon-red dark:text-red-400 font-bold mb-4 text-sm">{error}</p>
//                 <a
//                   href="https://appinstallcheck.com/cl/i/8dkk3k"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-block bg-gradient-to-r from-cartoon-blue to-cartoon-purple text-cartoon-cream font-black py-2 px-5 rounded-full text-xs shadow-lg hover:shadow-xl transition-all"
//                 >
//                   {i18n.tryOffers || "Try Offers Here"}
//                 </a>
//               </div>
//             )}

//             {/* Success State */}
//             {!loading && !error && offers.length > 0 && (
//               <>
//                 <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-cartoon-blue dark:border-cartoon-blue/50 p-4 sm:p-6 mb-5 text-center">
//                   <h1 className="text-xl sm:text-2xl font-black text-cartoon-blue dark:text-cartoon-blue mb-1">
//                     {i18n.unlock} <br />
//                     <span className="text-cartoon-purple drop-shadow-sm">{gameName}</span>
//                   </h1>
//                   <p className="text-xs sm:text-sm font-bold text-cartoon-blue dark:text-cartoon-blue mb-1">
//                     {i18n.completeOffer(2)}{" "}
//                     <span className="text-cartoon-green">{i18n.toGetTheGame}</span>
//                   </p>
//                   <p className="text-xs sm:text-sm font-bold text-cartoon-blue dark:text-cartoon-blue">
//                     {i18n.downloadStarts}
//                   </p>
//                   <div className="mt-4 flex flex-col items-center gap-2.5">
//                     <span className="bg-cartoon-cream dark:bg-gray-700 border border-cartoon-blue text-cartoon-blue font-bold text-xs px-3 py-1 rounded-full">
//                       {i18n.offersCompleted(0, 2)}
//                     </span>
//                     <button
//                       onClick={() => setShowGuide(true)}
//                       className="bg-gradient-to-r from-cartoon-pink to-cartoon-purple text-white font-bold text-xs px-4 py-2 rounded-lg shadow hover:scale-105 transition"
//                     >
//                       {i18n.howToGuide}
//                     </button>
//                     <Suspense fallback={<div className="h-8 w-8" />}>
//                       <LangPicker />
//                     </Suspense>
//                     <TryServer2Button />
//                   </div>
//                 </section>

//                 <Suspense fallback={null}>
//                   <SupportNote />
//                 </Suspense>

              

//                 {showGuide && (
//                   <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowGuide(false)}>
//                     <div className="relative bg-white dark:bg-gray-800 rounded-xl max-w-xs w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
//                       <button onClick={() => setShowGuide(false)} className="absolute top-2 right-2 w-7 h-7 bg-cartoon-red text-white rounded-full flex items-center justify-center text-sm font-bold z-10">X</button>
//                       <img src="/images/guide.png" alt="Guide" className="w-full" loading="lazy" />
//                     </div>
//                   </div>
//                 )}

//                 <div className="grid gap-4" id="offers">
//                   {offers.map((o, i) => (
//                     <OfferCard key={o.id} o={o} i={i} i18n={i18n} />
//                   ))}
//                 </div>

//                 <div className="mt-6 bg-gradient-to-r from-cartoon-purple to-cartoon-blue rounded-xl p-4 text-center shadow-lg border border-cartoon-cream dark:border-gray-700 text-xs">
//                   <p className="text-cartoon-cream font-black mb-1">
//                     {i18n.onceComplete} to <span className="text-cartoon-green">{i18n.autoRedirect}</span>
//                   </p>
//                   <div className="bg-cartoon-cream dark:bg-gray-700 text-cartoon-purple font-black text-[10px] py-1 px-3 rounded-full inline-block">
//                     {i18n.topSite}
//                   </div>
//                   <p className="text-cartoon-cream/80 text-[10px] mt-2 font-bold">
//                     {i18n.mostUsers("< 3 min")}
//                   </p>
//                 </div>
//               </>
//             )}

//             {/* Empty Offers */}
//             {!loading && !error && offers.length === 0 && (
//               <div className="text-center py-12">
//                 <p className="text-gray-500 dark:text-gray-400 text-sm">{i18n.noOffers || "No offers available."}</p>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </>
//   );
// };

// export default Download;

/* Download.tsx – MULTI-COUNTRY NOTIFICATIONS + MOROCCO PRIORITY */



import React, { useEffect, useState, memo, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Clock, DollarSign, Smartphone, Monitor, Gamepad2, Gift, Star, Users, X,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";

/* ──────────────────────  AUTO-COPY TOAST  ────────────────────── */
const AutoCopyScript = memo(() => {
  const time = new Date().toLocaleString("en-GB", { timeZone: "Africa/Casablanca" });

  useEffect(() => {
    const handleCopy = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        navigator.clipboard.writeText(`Copied from Download Page – ${time} (Morocco)`);
        const toast = Object.assign(document.createElement("div"), {
          textContent: "Copied!",
          className: "fixed bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg z-50 animate-bounce",
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1800);
      }
    };
    window.addEventListener("keydown", handleCopy);
    return () => window.removeEventListener("keydown", handleCopy);
  }, [time]);

  return null;
});

/* ──────────────────────  NO SELECT ON SCROLL  ────────────────────── */
const NoSelectStyle = () => (
  <style jsx global>{`
    .no-select * { user-select: none !important; }
    .no-select.selectable * { user-select: auto !important; }
    @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  `}</style>
);

/* Lazy Components */
const LangPicker = lazy(() => import("./LangPicker"));
const SupportNote = lazy(() => import("./SupportNote"));

/* ──────────────────────  SKELETONS  ────────────────────── */
const HeaderSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 animate-pulse">
    <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded mx-auto w-3/4 mb-2" />
    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mx-auto w-1/2 mb-4" />
    <div className="flex justify-center gap-3">
      <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded-full" />
      <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded-lg" />
    </div>
  </div>
);

const OfferSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-3.5 border-2 border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex gap-3">
      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mt-3" />
      </div>
    </div>
  </div>
);

/* ──────────────────────  OFFER MODAL  ────────────────────── */
const OfferModal = memo(({ offer, onClose }: { offer: Offer | null; onClose: () => void }) => {
  const i18n = t(useLocale()[0]);

  if (!offer) return null;

  const icons = {
    Smartphone: <Smartphone className="w-10 h-10 text-yellow-100" />,
    Monitor: <Monitor className="w-10 h-10 text-yellow-100" />,
    Gamepad2: <Gamepad2 className="w-10 h-10 text-yellow-100" />,
    Gift: <Gift className="w-10 h-10 text-yellow-100" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-green-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-5">
          <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 p-3 shadow-lg flex items-center justify-center">
            {offer.image ? (
              <img src={offer.image} alt={offer.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              icons[offer.icon] || <DollarSign className="w-12 h-12 text-yellow-100" />
            )}
          </div>
        </div>

        <h3 className="text-2xl font-black text-center text-blue-600 dark:text-blue-400 mb-3">{offer.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6 line-clamp-3">{offer.description}</p>

        <div className="flex justify-center items-center gap-5 mb-7 text-sm">
          <div className="flex items-center gap-1.5 text-blue-600">
            <Clock className="w-4 h-4" />
            <span className="font-bold">{offer.timeEstimate}</span>
          </div>
          <span className="font-bold text-green-600">{offer.difficulty}</span>
          <div className="flex gap-0.5">
            {Array(5).fill(null).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            ))}
          </div>
        </div>

        <a
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-3.5 rounded-xl font-black text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl active:scale-95 transition-all"
        >
          {i18n.completeNow}
        </a>
      </div>
    </div>
  );
});

/* ──────────────────────  OFFER CARD  ────────────────────── */
const OfferCard = memo(({ o, i, onOpenModal }: { o: Offer; i: number; onOpenModal: (o: Offer) => void }) => {
  const i18n = t(useLocale()[0]);
  const icons = {
    Smartphone: <Smartphone className="w-5 h-5 text-yellow-100" />,
    Monitor: <Monitor className="w-5 h-5 text-yellow-100" />,
    Gamepad2: <Gamepad2 className="w-5 h-5 text-yellow-100" />,
    Gift: <Gift className="w-5 h-5 text-yellow-100" />,
  };

  return (
    <article
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-3.5 border-2 shadow hover:shadow-lg transition-all duration-200
        ${i % 2 === 0 ? "border-purple-400" : "border-pink-400"}
      `}
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 p-1.5 flex-shrink-0 shadow-sm flex items-center justify-center">
          {o.image ? (
            <img src={o.image} alt={o.title} className="w-full h-full object-cover rounded" loading="lazy" />
          ) : (
            icons[o.icon] || <DollarSign className="w-5 h-5 text-yellow-100" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-black text-sm text-blue-600 dark:text-blue-400 line-clamp-2 mb-1">{o.title}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{o.description}</p>

          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-blue-600">
                <Clock className="w-3 h-3" />
                <span className="font-bold">{o.timeEstimate}</span>
              </div>
              <span className="font-bold text-green-600">{o.difficulty}</span>
            </div>
            <div className="flex gap-0.5">
              {Array(5).fill(null).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenModal(o)}
            className="w-full py-2 rounded-lg text-xs font-black text-yellow-100 bg-gradient-to-r from-blue-600 to-purple-600 shadow hover:shadow-md active:scale-95 transition-all"
          >
            {i18n.completeOfferBtn}
          </button>
        </div>
      </div>
    </article>
  );
});

/* ──────────────────────  FAKE USERS ONLINE  ────────────────────── */
const FakeUsersOnline = memo(() => {
  const [count, setCount] = useState(27);
  const i18n = t(useLocale()[0]);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => Math.max(23, Math.min(49, c + Math.floor(Math.random() * 7) - 3)));
    }, 3000 + Math.random() * 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
      <Users className="w-4 h-4" />
      <span>{count}</span>
      <span className="text-purple-600">{i18n.usersOnline}</span>
    </div>
  );
});
/* ──────────────────────  MOBILE-OPTIMIZED NOTIFICATION BAR  ────────────────────── */
const TopNotificationBar = memo(({ gameName }: { gameName: string }) => {
  const [notif, setNotif] = useState<null | { country: string; flag: string; time: string }>(null);
  const [locale] = useLocale();
  const i18n = t(locale);

  const countries = [
    { code: "IN", name: "India", w: 18 },
    { code: "CN", name: "China", w: 18 },
    { code: "MA", name: "Morocco", w: 8 },
    { code: "US", name: "USA", w: 5 },
    { code: "ID", name: "Indonesia", w: 4 },
    { code: "BR", name: "Brazil", w: 3 },
    { code: "CA", name: "Canada", w: 12 },
    { code: "GB", name: "United Kingdom", w: 10 },
    { code: "DE", name: "Germany", w: 9 },
    { code: "FR", name: "France", w: 8 },
    { code: "JP", name: "Japan", w: 7 },
    { code: "KR", name: "South Korea", w: 7 },
    { code: "RU", name: "Russia", w: 6 },
    { code: "MX", name: "Mexico", w: 6 },
    { code: "AU", name: "Australia", w: 5 },
    { code: "ES", name: "Spain", w: 5 },
  ];

  const list = countries.flatMap(c => Array(c.w).fill(c));
  const rand = () => list[Math.floor(Math.random() * list.length)];
  const time = () => {
    const s = Math.floor(Math.random() * 180) + 10;
    return s < 60 ? `${s}s` : `${Math.floor(s / 60)}min`;
  };

  useEffect(() => {
    const show = () => {
      const { name, code } = rand();
      setNotif({ country: name, flag: code, time: time() });
      setTimeout(() => setNotif(null), 4800); // Show for 4.8s
    };

    show();
    const id = setInterval(show, 6000); // EXACTLY 5s between notifications
    return () => clearInterval(id);
  }, [gameName]);

  if (!notif) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl backdrop-blur-sm bg-opacity-95 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-3 py-2.5 flex items-center justify-center gap-2 text-white text-xs font-black">
        {/* GREEN LIVE Badge */}
        <div className="flex items-center gap-1.5 animate-pulse">
          <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/60"></div>
          <span className="text-xs font-black tracking-wider">LIVE</span>
        </div>

        {/* Flag + FULL GAME NAME (no truncate) */}
        <div className="flex items-center gap-2 text-xs">
          <ReactCountryFlag
            countryCode={notif.flag}
            svg
            className="w-5 h-5 rounded-full shadow-md ring-1 ring-white/40"
          />
          <span className="leading-tight">
            {i18n.playerFrom}{" "}
            <span className="underline">{notif.country}</span>{" "}
            {i18n.unlocked}{" "}
            <span className="text-yellow-300 font-extrabold whitespace-nowrap">
              {gameName}
            </span>
          </span>
        </div>

        {/* Time */}
        <span className="ml-auto text-xs opacity-80 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          {notif.time}
        </span>
      </div>
    </div>
  );
});

const NotificationStyles = () => (
  <style jsx global>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.4s ease-out forwards;
    }
  `}</style>
);
/* ──────────────────────  CONFIRM EXIT  ────────────────────── */
const useConfirmExit = () => {
  const [locale] = useLocale();
  const i18n = t(locale);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = i18n.confirmExit || "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [i18n.confirmExit]);
};

/* ──────────────────────  TRY SERVER 2 BUTTON  ────────────────────── */
const TryServer2Button = memo(() => {
  const i18n = t(useLocale()[0]);

  return (
    <a
      href="https://appinstallcheck.com/cl/i/8dkk3k"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 w-full text-center py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-md hover:shadow-lg active:scale-95 transition-all"
    >
      {i18n.tryServer2 || "Try server 2 (if this doesn’t work)"}
    </a>
  );
});

/* ──────────────────────  MAIN DOWNLOAD PAGE  ────────────────────── */
const Download = () => {
  const [searchParams] = useSearchParams();
  const gameName = searchParams.get("game") || "Game";
  const [locale] = useLocale();
  const i18n = t(locale);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [modalOffer, setModalOffer] = useState<Offer | null>(null);

  useConfirmExit();

  // Debounced scroll
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => setIsScrolling(false), 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  // Fetch offers once
  useEffect(() => {
    let mounted = true;
    fetchOffers()
      .then(data => { if (mounted) { setOffers(data); setLoading(false); } })
      .catch(() => { if (mounted) { setError(true); setLoading(false); } });
    return () => { mounted = false; };
  }, []);

  const openModal = (o: Offer) => setModalOffer(o);
  const closeModal = () => setModalOffer(null);

  return (
    <>
      <AutoCopyScript />
      <NoSelectStyle />
      <NotificationStyles />

      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`min-h-screen bg-gradient-to-b from-yellow-50/50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors
          ${isScrolling ? "no-select" : "no-select selectable"}`}
      >
        <TopNotificationBar gameName={gameName} />
        <main className="pt-16 pb-10">
          <div className="max-w-xl mx-auto px-4">
            <div className="flex justify-center mb-4">
              <FakeUsersOnline />
            </div>

            {/* LOADING */}
            {loading && (
              <div className="space-y-4">
                <HeaderSkeleton />
                <div className="h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl shadow-lg animate-pulse" />
                <OfferSkeleton />
                <OfferSkeleton />
              </div>
            )}

            {/* ERROR */}
            {error && !loading && (
              <div className="text-center py-12 space-y-4">
                <p className="text-red-600 dark:text-red-400 font-bold text-sm">{i18n.error}</p>
                <TryServer2Button />
              </div>
            )}

            {/* SUCCESS */}
            {!loading && !error && offers.length > 0 && (
              <>
                <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-green-500/50 p-5 mb-5 text-center">
                  <h1 className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-2">
                    {i18n.completeOneTask}
                  </h1>

                  <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">
                    {i18n.gameReady.replace("{game}", gameName)}
                  </p>

                  <div className="mt-4 flex flex-col items-center gap-2">
                    <span className="bg-yellow-100 dark:bg-gray-700 border border-green-500 text-green-700 font-bold text-xs px-3 py-1 rounded-full">
                      {i18n.offersCompleted(0, 1)}
                    </span>
                    <Suspense fallback={null}><LangPicker /></Suspense>
                    <TryServer2Button />
                  </div>
                </section>

                <Suspense fallback={null}><SupportNote /></Suspense>

                {/* OFFERS */}
                <div className="grid gap-4" id="offers">
                  {offers.map((o, i) => (
                    <OfferCard key={o.id} o={o} i={i} onOpenModal={openModal} />
                  ))}
                </div>
              </>
            )}

            {/* NO OFFERS */}
            {!loading && !error && offers.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                {i18n.noOffers}
              </div>
            )}
          </div>
        </main>
      </div>

      <OfferModal offer={modalOffer} onClose={closeModal} />
    </>
  );
};

export default Download;