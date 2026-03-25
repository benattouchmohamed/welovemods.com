import React, { useEffect, useState, memo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  AlertCircle,
  CheckCircle2,
  Star,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGameBySlug, type Game } from "@/services/gameService";
import { sendTelegramNotification } from "@/services/geoService";

const ORANGE = "#FF6B2C";
const ORANGE_DARK = "#E8541A";
const ORANGE_GLOW = "rgba(255,107,44,0.32)";

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
const shimmer = "bg-gradient-to-r from-muted via-accent/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite]";

const BeautifulSkeleton = () => (
  <div className="min-h-screen bg-[hsl(var(--card))] px-4 py-6">
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <div className={`w-32 h-6 rounded-full ${shimmer}`} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="md:col-span-5 lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-white p-5 border border-[hsl(var(--border))]" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className={`aspect-square rounded-2xl ${shimmer}`} />
            <div className={`h-14 mt-5 rounded-2xl ${shimmer}`} />
          </div>
          <div className="bg-white rounded-2xl border border-[hsl(var(--border))] p-4 flex justify-around" style={{ boxShadow: "var(--shadow-base)" }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-3 rounded ${shimmer}`} />
                <div className={`w-8 h-5 rounded ${shimmer}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-7 lg:col-span-8 space-y-5">
          {/* Title */}
          <div className="space-y-3">
            <div className={`h-12 w-3/4 rounded-xl ${shimmer}`} />
            <div className={`h-7 w-1/2 rounded-xl ${shimmer}`} />
            <div className="flex gap-2">
              <div className={`h-7 w-28 rounded-full ${shimmer}`} />
              <div className={`h-7 w-32 rounded-full ${shimmer}`} />
              <div className={`h-7 w-28 rounded-full ${shimmer}`} />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-5 border border-[hsl(var(--border))] space-y-2" style={{ boxShadow: "var(--shadow-base)" }}>
            <div className={`h-4 w-full rounded ${shimmer}`} />
            <div className={`h-4 w-5/6 rounded ${shimmer}`} />
            <div className={`h-4 w-2/3 rounded ${shimmer}`} />
          </div>

          {/* Features */}
          <div className="bg-white rounded-3xl p-6 border border-[hsl(var(--border))]" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className={`h-4 w-36 rounded mb-4 ${shimmer}`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-12 rounded-xl ${shimmer}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
const GameDetail = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

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
        setTimeout(() => setLoading(false), 400);
      }
    };
    loadGame();
  }, [slug]);

  // Handler for download click — fires Telegram notification then navigates
  const handleDownloadClick = async (gameName: string, imageUrl: string) => {
    if (imageUrl) {
      sessionStorage.setItem("downloadGameImage", imageUrl);
    }
    // Fire-and-forget — don't await so navigation is instant
    sendTelegramNotification(gameName);
  };

  return (
    <>
      <Helmet>
        <title>{game ? `Download ${game.title} Mod APK 2026 – Free & Safe` : "Loading..."} | WeLoveMods</title>
        {game && (
          <>
            <meta name="description" content={`Download ${game.title} Mod APK v${game.version} for Android. ${game.features?.slice(0, 3).join(', ')}. 100% safe, no root required. Free download 2026.`} />
            <link rel="canonical" href={`https://welovemods.com/game/${slug}`} />
            <meta property="og:title" content={`${game.title} Mod APK – Free Download 2026`} />
            <meta property="og:description" content={game.description} />
            <meta property="og:image" content={game.image_url} />
            <meta property="og:type" content="article" />
            <script type="application/ld+json">{JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": game.title,
              "operatingSystem": "Android",
              "applicationCategory": "GameApplication",
              "softwareVersion": game.version,
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": game.rating,
                "ratingCount": game.downloads,
                "bestRating": "5"
              },
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            })}</script>
          </>
        )}
      </Helmet>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BeautifulSkeleton />
          </motion.div>
        ) : !game ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[hsl(var(--card))] flex flex-col items-center justify-center px-4 text-center gap-4"
          >
            <AlertCircle className="w-14 h-14" style={{ color: ORANGE }} />
            <h1 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">
              Mod Not Found
            </h1>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3.5 text-white font-bold rounded-2xl transition-all hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                boxShadow: `0 4px 16px ${ORANGE_GLOW}`,
              }}
            >
              Back to Home
            </button>
          </motion.div>
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-[hsl(var(--card))] pb-16 px-4 pt-6 overflow-x-hidden"
          >
            <div className="w-full max-w-5xl mx-auto space-y-8">

              {/* Back */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors group"
              >
                <ArrowLeft
                  size={14}
                  strokeWidth={2.5}
                  className="group-hover:-translate-x-0.5 transition-transform"
                />
                Back to mods
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">

                {/* ── LEFT COLUMN ── */}
                <div className="md:col-span-5 lg:col-span-4 space-y-4">
                  <div
                    className="rounded-3xl p-5 bg-white border border-[hsl(var(--border))] relative overflow-hidden"
                    style={{ boxShadow: "var(--shadow-lg)" }}
                  >
                    {/* Orange top accent */}
                    <span
                      className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`,
                      }}
                    />

                    {/* Game image */}
                    <div className="relative">
                      <img
                        src={game.image_url}
                        alt={game.title}
                        className="w-full aspect-square object-cover rounded-2xl border border-[hsl(var(--border))]"
                      />
                      <div className="absolute -bottom-3 -right-3 bg-emerald-500 p-2 rounded-full border-4 border-white shadow-lg">
                        <ShieldCheck
                          size={16}
                          className="text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>

                    {/* Download Button */}
                    <motion.div whileTap={{ scale: 0.97 }} className="mt-6">
                      <Link
                        to={`/Download/${encodeURIComponent(game.title)}`}
                        onClick={() =>
                          handleDownloadClick(game.title, game.image_url)
                        }
                        className="relative w-full flex items-center justify-center gap-2.5 text-white font-bold text-sm uppercase tracking-widest rounded-2xl py-4 overflow-hidden transition-all hover:brightness-110"
                        style={{
                          background:
                            "linear-gradient(135deg, #22c55e, #15803d)",
                          boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
                        }}
                      >
                        {/* Shimmer */}
                        <span
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            animation: "shine 2.5s infinite",
                            background:
                              "linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)",
                          }}
                        />
                        <Download size={17} strokeWidth={2.5} />
                        Download Free
                      </Link>
                    </motion.div>
                  </div>

                  {/* Stats bar */}
                  <div
                    className="bg-white rounded-2xl border border-[hsl(var(--border))] p-4 flex justify-around items-center"
                    style={{ boxShadow: "var(--shadow-base)" }}
                  >
                    <div className="text-center">
                      <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                        Rating
                      </p>
                      <div className="flex items-center gap-1 justify-center mt-1">
                        <Star
                          size={13}
                          className="fill-amber-400 text-amber-400"
                        />
                        <span className="font-bold text-[hsl(var(--foreground))]">
                          {game.rating}
                        </span>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-[hsl(var(--border))]" />
                    <div className="text-center">
                      <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                        Version
                      </p>
                      <p className="font-bold text-[hsl(var(--foreground))] mt-1">
                        v{game.version}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-[hsl(var(--border))]" />
                    <div className="text-center">
                      <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                        Users
                      </p>
                      <p className="font-bold text-[hsl(var(--foreground))] mt-1">
                        {(game.downloads / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="md:col-span-7 lg:col-span-8 space-y-5">

                  {/* Title */}
                  <div className="space-y-3">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[hsl(var(--foreground))] leading-none tracking-tight">
                      {game.title}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                        }}
                      >
                        Premium Mod
                      </span>
                      <span className="bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] px-3 py-1.5 rounded-full text-xs font-semibold border border-[hsl(var(--border))]">
                        {game.downloads.toLocaleString()} Users
                      </span>
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-100">
                        <ShieldCheck size={11} strokeWidth={2.5} /> Verified
                        Safe
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div
                    className="bg-white rounded-2xl p-5 border border-[hsl(var(--border))]"
                    style={{
                      boxShadow: "var(--shadow-base)",
                      borderLeft: `3px solid ${ORANGE}`,
                    }}
                  >
                    <p className="text-base text-[hsl(var(--foreground))] font-medium leading-relaxed">
                      "{game.description}"
                    </p>
                  </div>

                  {/* Features */}
                  {game.features && game.features.length > 0 && (
                    <div
                      className="bg-white rounded-3xl p-6 border border-[hsl(var(--border))]"
                      style={{ boxShadow: "var(--shadow-lg)" }}
                    >
                      <h3
                        className="font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2"
                        style={{ color: ORANGE }}
                      >
                        <Zap size={13} className="fill-current" /> Features
                        Unlocked
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {game.features.map((feature, i) => (
                          <div
                            key={i}
                            className="bg-[hsl(var(--muted))] px-4 py-3 rounded-xl border border-[hsl(var(--border))] font-medium text-[hsl(var(--foreground))] flex items-center gap-3 text-sm"
                          >
                            <CheckCircle2
                              size={15}
                              strokeWidth={2.5}
                              className="text-emerald-500 shrink-0"
                            />
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Trust badges */}
                      <div className="mt-5 pt-4 border-t border-[hsl(var(--border))] flex flex-wrap gap-3">
                        {["Full Unlocks", "No Root", "No Ban"].map((badge) => (
                          <span
                            key={badge}
                            className="flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-3 py-1.5 rounded-full border border-[hsl(var(--border))]"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <style>{`
              @keyframes shine {
                0%   { transform: translateX(-100%) skewX(-15deg); }
                100% { transform: translateX(350%)  skewX(-15deg); }
              }
            `}</style>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
});

export default GameDetail;