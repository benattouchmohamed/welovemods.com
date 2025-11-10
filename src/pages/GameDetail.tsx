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
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Box } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { fetchGameBySlug, Game } from "@/services/gameService";
import RatingStars from "@/components/RatingStars";

const GameDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  // -----------------------------------------------------------------
  // Load game
  // -----------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        const data = await fetchGameBySlug(slug);
        setGame(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  // -----------------------------------------------------------------
  // Download handler (kept your original logic)
  // -----------------------------------------------------------------
  const handleDownload = () => {
    if (!game) return;
    setIsDownloading(true);
    setTimeout(() => {
      navigate(`/Download?game=${encodeURIComponent(game.title)}`);
    }, 800);
  };
// const handleDownload = () => {
//   window.location.href = "https://appinstallcheck.com/cl/i/8dkk3k";
// };
  // -----------------------------------------------------------------
  // Simple skeleton (lightweight)
  // -----------------------------------------------------------------
  const SimpleSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
            {/* Image placeholder */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-4 shadow-lg">
                <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-full h-64" />
                <div className="mt-6 h-14 bg-gray-200 rounded-2xl" />
              </div>
            </div>

            {/* Details placeholder */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-md">
                <div className="h-9 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="h-10 bg-gray-200 rounded w-12 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="h-10 bg-gray-200 rounded w-12 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-md">
                <div className="h-7 bg-gray-200 rounded w-32 mb-3" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="w-3 h-3 bg-gray-200 rounded-full" />
                      <div className="h-4 bg-gray-200 rounded flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen overflow-hidden">
      <Helmet>
        {loading ? (
          <>
            <title>Loading... | AppsMod</title>
            <meta name="description" content="Loading game details..." />
          </>
        ) : !game ? (
          <>
            <title>Game Not Found | AppsMod</title>
            <meta name="description" content="Game not found." />
          </>
        ) : (
          <>
            <title>{game.title} Mod APK 2025 - Unlimited Coins | AppsMod</title>
            <meta
              name="description"
              content={`Download ${game.title} Mod APK 2025 with unlimited coins, unlocked features.`}
            />
            <meta name="keywords" content={`${game.title} mod, cheats 2025, unlimited coins`} />
            <meta property="og:title" content={`${game.title} Mod APK 2025`} />
            <meta property="og:image" content={game.image_url} />
            <link rel="canonical" href={`https://welovemods.com/game/${slug}`} />
          </>
        )}
      </Helmet>

      <Navbar />

      {/* Loading */}
      {loading && <SimpleSkeleton />}

      {/* Not found */}
      {!loading && !game && (
        <main className="pt-20 pb-12 text-center">
          <h1 className="text-5xl font-black text-red-600 mb-6">Game Not Found!</h1>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 rounded-full flex items-center mx-auto"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back to Games
          </Button>
        </main>
      )}

      {/* Game loaded */}
      {!loading && game && (
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Image + Download */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-4 shadow-lg border-4 border-blue-200">
                  <img
                    src={game.image_url || "/placeholder.svg"}
                    alt={`${game.title} thumbnail`}
                    className="w-full aspect-square object-cover rounded-2xl"
                  />
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition"
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Download className="w-6 h-6" />
                        DOWNLOAD NOW!
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title & Rating */}
                <div className="bg-white rounded-3xl p-6 shadow-md border-4 border-pink-200">
                  <h1 className="text-3xl lg:text-4xl font-black text-red-600 mb-3">{game.title}</h1>
                  <div className="flex items-center gap-3">
                    <RatingStars rating={game.rating} />
                    <span className="text-xl font-bold text-blue-600">{game.rating}/5</span>
                  </div>
                  <p className="mt-4 text-gray-700 text-lg">{game.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-yellow-100 rounded-2xl p-4 border-2 border-yellow-400">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-500 p-3 rounded-xl">
                        <Download className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-yellow-800">Downloads</div>
                        <div className="text-xl font-black">{game.downloads.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-pink-100 rounded-2xl p-4 border-2 border-pink-400">
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-500 p-3 rounded-xl">
                        <Box className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-pink-800">Version</div>
                        <div className="text-xl font-black">{game.version}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {game.features?.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 shadow-md border-4 border-green-200">
                    <h3 className="text-2xl font-black text-green-600 mb-4">MOD Features</h3>
                    <ul className="space-y-2">
                      {game.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="font-medium text-lg">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl p-6 text-center shadow-lg border-4 border-red-300">
                  <h3 className="text-2xl font-black text-white mb-2">Ready to Play?</h3>
                  <p className="text-white/90 font-bold mb-4">
                    Join thousands of players!
                  </p>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-white text-red-600 font-black px-8 py-3 rounded-full shadow-md hover:shadow-lg transition"
                  >
                    {isDownloading ? "Preparing..." : "Download & Install Now!"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      
    </div>
  );
};

export default GameDetail;