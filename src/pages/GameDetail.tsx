import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [checkingGeo, setCheckingGeo] = useState(false);
  const navigate = useNavigate();

  /* ────────────────────── FETCH GAME ────────────────────── */
  useEffect(() => {
    const load = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchGameBySlug(slug);
        setGame(data);
      } catch (err) {
        console.error("Failed to fetch game:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  /* ────────────────────── COUNTRY DETECTION + DOWNLOAD ────────────────────── */
  const handleDownload = async () => {
    if (!game || isDownloading) return;

    setIsDownloading(true);
    setCheckingGeo(true);

    // Restricted countries (lowercase)
    // const RESTRICTED_COUNTRIES = ["pk", "bd", "iq", "in", "vn", "my", "id", "ph"];
const RESTRICTED_COUNTRIES = [];
    // Check if already checked this session
    const geoChecked = sessionStorage.getItem("geoChecked") === "done";
    let userCountry = sessionStorage.getItem("userCountry") || "";

    if (!geoChecked) {
      try {
        // Primary: ipapi.co (reliable + fast)
        const res = await fetch("https://ipapi.co/json/", {
          signal: AbortSignal.timeout(6000),
        });
        if (res.ok) {
          const data = await res.json();
          userCountry = (data.country_code || "").toLowerCase();
        }
      } catch (e) {
        // Fallback: geojs.io
        try {
          const res = await fetch("https://get.geojs.io/v1/ip/country.json");
          if (res.ok) {
            const data = await res.json();
            userCountry = (data.country || "").toLowerCase();
          }
        } catch {}
      }

      // Save for this session
      sessionStorage.setItem("geoChecked", "done");
      sessionStorage.setItem("userCountry", userCountry);
    }

    // BLOCKED COUNTRY → Redirect to /adblue
    if (RESTRICTED_COUNTRIES.includes(userCountry)) {
      window.location.replace("/adblue");
      return; // Stop execution
    }

    setCheckingGeo(false);

    // === ALLOWED COUNTRY → Continue Download ===
    let imgDataUrl = "";
    if (game.image_url) {
      try {
        const resp = await fetch(game.image_url, { mode: "cors" });
        if (!resp.ok) throw new Error("Image fetch failed");
        const blob = await resp.blob();
        imgDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.warn("Image → base64 failed, using direct URL:", e);
        imgDataUrl = game.image_url;
      }
    }

    sessionStorage.setItem("downloadGameImage", imgDataUrl);

    setTimeout(() => {
      navigate(`/Download?game=${encodeURIComponent(game.title)}`);
    }, 400);
  };

  /* ────────────────────── SKELETON LOADER ────────────────────── */
  const BeautifulSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-xl border-4 border-blue-200/50 animate-pulse">
                <div className="bg-gradient-to-br from-blue-200 to-purple-200 border-2 border-dashed rounded-2xl w-full h-64 shimmer" />
                <div className="mt-6 h-14 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl shimmer" />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-4 border-pink-200/50 animate-pulse">
                <div className="h-10 bg-gradient-to-r from-red-300 to-pink-300 rounded-lg w-3/4 mb-3 shimmer" />
                <div className="h-7 bg-gradient-to-r from-purple-300 to-blue-300 rounded-lg w-1/2 mb-4 shimmer" />
                <div className="space-y-2">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer" />
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6 shimmer" />
                </div>
              </div>
              {/* More skeleton blocks... */}
            </div>
          </div>
        </div>
      </main>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 1.8s infinite;
        }
      `}</style>
    </div>
  );

  /* ────────────────────── RENDER ────────────────────── */
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
              content={`Download ${game.title} Mod APK latest version with unlimited money, gems, and all features unlocked.`}
            />
            <meta name="keywords" content={`${game.title} mod apk, ${game.title} hack, unlimited coins, 2025`} />
            <meta property="og:title" content={`${game.title} Mod APK 2025`} />
            <meta property="og:image" content={game.image_url || ""} />
            <link rel="canonical" href={`https://welovemods.com/game/${slug}`} />
          </>
        )}
      </Helmet>

      <Navbar />

      {loading && <BeautifulSkeleton />}

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

      {!loading && game && (
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* IMAGE + DOWNLOAD BUTTON */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-4 shadow-lg border-4 border-blue-200">
                  <img
                    src={game.image_url || "/placeholder.svg"}
                    alt={`${game.title} thumbnail`}
                    className="w-full aspect-square object-cover rounded-2xl"
                    loading="lazy"
                  />
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading || checkingGeo}
                    className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {checkingGeo ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Checking region...
                      </>
                    ) : isDownloading ? (
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

              {/* DETAILS */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-md border-4 border-pink-200">
                  <h1 className="text-3xl lg:text-4xl font-black text-red-600 mb-3">
                    {game.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    <RatingStars rating={game.rating} />
                    <span className="text-xl font-bold text-blue-600">{game.rating}/5</span>
                  </div>
                  <p className="mt-4 text-gray-700 text-lg">{game.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-yellow-100 rounded-2xl p-4 border-2 border-yellow-400">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-500 p-3 rounded-xl">
                        <Download className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-yellow-800">Downloads</div>
                        <div className="text-xl text-yellow-800 font-black">
                          {game.downloads.toLocaleString()}
                        </div>
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
                        <div className="text-xl text-pink-800 font-black">{game.version}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {game.features && game.features.length > 0 && (
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

                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl p-6 text-center shadow-lg border-4 border-red-300">
                  <h3 className="text-2xl font-black text-white mb-2">Ready to Play?</h3>
                  <p className="text-white/90 font-bold mb-4">Join millions of happy players!</p>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading || checkingGeo}
                    className="bg-white text-red-600 font-black px-8 py-3 rounded-full shadow-md hover:shadow-lg transition disabled:opacity-70"
                  >
                    {checkingGeo ? "Checking..." : "Download & Install Now!"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )} <br />

      {/* <Footer /> */}
    </div>
  );
};

export default GameDetail;