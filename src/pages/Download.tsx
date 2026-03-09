import React, { useEffect, useState } from "react";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const FALLBACK_URL = "https://applocked.store/cl/i/8dkk3k";

const injectTrackingScript = () => {
  if (document.getElementById("ogjs")) return;
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.id = "ogjs";
  script.src = "https://lockedapp.store/cl/js/8dkk3k";
  script.async = true;
  document.head.appendChild(script);
};

/* ─────────────────────────────────────────────
   LOADING
───────────────────────────────────────────── */
const LoadingScreen = () => (
  <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center gap-4">
    <div
      className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
      style={{ borderColor: "#FF6B2C transparent #ffdf2c #FF6B2C" }}
    />
    <p className="text-white/60 text-xs font-semibold uppercase tracking-widest animate-pulse">
      Loading ...
    </p>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function DownloadPage() {
  const { appName } = useParams<{ appName: string }>();
  const gameName = appName ? decodeURIComponent(appName) : "Premium Mod";

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameImage, setGameImage] = useState<string | null>(null);

  // Offer click state
  const [offerClicked, setOfferClicked] = useState(false);

  // Server 2 state
  const [server2Loading, setServer2Loading] = useState(false);
  const [server2Done, setServer2Done] = useState(false);

  useEffect(() => {
    const img = sessionStorage.getItem("downloadGameImage");
    if (img) setGameImage(img);

    let mounted = true;

    const loadData = async () => {
      // Always show loading state first
      setLoading(true);
      setOffers([]);

      try {
        // Add a cache-busting timestamp to force a fresh fetch every time
        const data = await fetchOffers();
        if (!mounted) return;

        if (data && data.length > 0) {
          setOffers(data.slice(0, 2)); // min 1, max 2
        } else {
          window.location.href = FALLBACK_URL;
          return;
        }
      } catch {
        if (!mounted) return;
        window.location.href = FALLBACK_URL;
        return;
      } finally {
        if (mounted) {
          // Small delay so the loading spinner is visible
          setTimeout(() => setLoading(false), 900);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []); // Empty deps — runs fresh on every mount (i.e. every page load/refresh)

  // Offer click → inject script after 3s delay
  const handleOfferClick = () => {
    if (offerClicked) return;
    setOfferClicked(true);
    setTimeout(() => {
      injectTrackingScript();
    }, 3000);
  };

  // Server 2 → inject script directly
  const handleServer2 = () => {
    if (server2Loading || server2Done) return;
    setServer2Loading(true);
    injectTrackingScript();
    setTimeout(() => {
      setServer2Loading(false);
      setServer2Done(true);
    }, 1800);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
      >

        {/* ── HEADER ── */}
        <div
          className="relative px-6 pt-8 pb-10 text-center overflow-hidden"
          style={{ background: "linear-gradient(160deg, #FF6B2C 0%, #E8541A 40%, #C2185B 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Game avatar */}
          <div className="relative mx-auto w-20 h-20 mb-4">
            <img
              src={gameImage || "/placeholder.svg"}
              alt={gameName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-xl"
            />
          </div>

          <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
            Verification Required
          </p>
          <h1 className="text-white font-extrabold text-2xl tracking-tight">
            Unlock {gameName}
          </h1>
          <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mt-1.5">
            Complete 1 offer · Keeps our service free
          </p>
        </div>

        {/* ── BODY ── */}
        <div className="bg-[#1a1a1a] px-4 py-5 space-y-3">

          {/* Offers — min 1, max 2 */}
          {offers.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "#242424" }}
            >
              <div className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#333]">
                  <img src={o.image} alt={o.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{o.title}</p>
                  <p className="text-[#FF6B2C] text-xs font-medium leading-snug mt-0.5 line-clamp-2">
                    {o.description}
                  </p>
                </div>
              </div>

              <a
                href={o.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOfferClick}
                className="flex items-center justify-center gap-2 w-full py-4 font-bold text-sm text-white uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: "linear-gradient(90deg, #FF6B2C, #E8541A, #C2185B)" }}
              >
                Click Here
                <ExternalLink size={14} strokeWidth={2.5} />
              </a>
            </motion.div>
          ))}

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Server 2 — clickable link */}
          <div className="text-center py-0.5">
            {server2Done ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-emerald-400 text-xs font-semibold"
              >
                ✓ Server 2 connected — check your downloads
              </motion.span>
            ) : (
              <button
                onClick={handleServer2}
                disabled={server2Loading}
                className="text-xs font-medium underline underline-offset-2 transition-all hover:opacity-70 active:scale-95"
                style={{ color: server2Loading ? "rgba(255,255,255,0.25)" : "#60a5fa" }}
              >
                {server2Loading
                  ? "Connecting to server 2..."
                  : "Not working? Try server 2 — click here"}
              </button>
            )}
          </div>

          {/* Trust footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 rounded-2xl p-4"
            style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            <CheckCircle2 size={18} strokeWidth={2} className="text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-emerald-300 text-xs font-medium leading-relaxed">
              Once you complete an offer, your download of{" "}
              <span className="font-bold text-white">{gameName}</span> will unlock instantly — fully free.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}