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

const ORANGE = "#FF6B2C";
const ORANGE_DARK = "#E8541A";
const ORANGE_GLOW = "rgba(255,107,44,0.32)";

const TELEGRAM_BOT_TOKEN = "7912646322:AAFaxiD7bfPj9dn35_kLep_YGfr5PyvrSZE";
const TELEGRAM_CHAT_ID = "6180902575";

/* ─────────────────────────────────────────────
   TELEGRAM NOTIFICATION
───────────────────────────────────────────── */
async function sendTelegramNotification(gameName: string) {
  try {
    // 1. Get IP + country from ipapi.co (same service used elsewhere in the project)
    let ip = "Unknown";
    let country = "Unknown";
    let city = "Unknown";

    try {
      const geoRes = await fetch("https://ipapi.co/json/");
      if (geoRes.ok) {
        const geo = await geoRes.json();
        ip = geo.ip ?? "Unknown";
        country = geo.country_name ?? geo.country ?? "Unknown";
        city = geo.city ?? "Unknown";
      }
    } catch {
      // geo failed silently — still send partial info
    }

    // 2. Referrer / traffic source
    const referrer = document.referrer
      ? new URL(document.referrer).hostname
      : "Direct / None";

    // 3. Build message
    const msg =
      `🎮 *New Download Intent*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *Game:* ${gameName}\n` +
      `🌍 *Country:* ${country} — ${city}\n` +
      `🖥️ *IP:* \`${ip}\`\n` +
      `🔗 *Ref Source:* ${referrer}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━`;

    // 4. Send
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: msg,
          parse_mode: "Markdown",
        }),
      }
    );
  } catch {
    // Never block UX on notification failure
  }
}

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
const BeautifulSkeleton = () => (
  <div className="min-h-screen bg-[hsl(var(--card))] px-4 py-6">
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
      <div className="w-36 h-7 bg-[hsl(var(--muted))] rounded-full" />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white p-5 border border-[hsl(var(--border))] shadow-[var(--shadow-lg)]">
            <div className="aspect-square rounded-2xl bg-[hsl(var(--muted))]" />
            <div className="h-12 mt-4 bg-[hsl(var(--muted))] rounded-2xl" />
          </div>
          <div className="h-16 rounded-2xl bg-white border border-[hsl(var(--border))]" />
        </div>
        <div className="md:col-span-7 space-y-4">
          <div className="h-16 bg-white/80 rounded-3xl" />
          <div className="flex gap-2">
            <div className="h-8 w-28 bg-[hsl(var(--muted))] rounded-full" />
            <div className="h-8 w-36 bg-[hsl(var(--muted))] rounded-full" />
          </div>
          <div className="h-28 bg-white rounded-2xl" />
          <div className="h-64 bg-white rounded-3xl border border-[hsl(var(--border))]" />
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
        setTimeout(() => setLoading(false), 700);
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
        <title>
          {game
            ? `${game.title} Mod APK 2026 | Safe Download`
            : "Loading Mod..."}{" "}
          | WeLoveMods
        </title>
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