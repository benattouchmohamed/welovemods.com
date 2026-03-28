import React, { useEffect, useState } from "react"; // v4
import { ExternalLink, ShieldCheck, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { detectGeo } from "@/services/geoService";

/* ─── CONFIG ─── */
const TELEGRAM_BOT_TOKEN = "7912646322:AAFaxiD7bfPj9dn35_kLep_YGfr5PyvrSZE";
const TELEGRAM_CHAT_ID   = "6180902575";

/* ─── TRANSLATIONS ─── */
const translations: Record<string, {
  verificationRequired: string;
  completeOffer: string;
  howItWorks: string;
  howItWorksBody: string;
  howItWorksHighlight: string;
  unlock: string;
  unlockInfoPrefix: string;
  unlockInfoSuffix: string;
  loading: string;
}> = {
  en: {
    verificationRequired: "Verification Required",
    completeOffer: "Complete 1 offer to unlock",
    howItWorks: "How it works",
    howItWorksBody: "Pick the offer below and follow its instructions — e.g. install and run for 30 seconds, complete a level, or sign up. Once done, your download unlocks immediately.",
    howItWorksHighlight: "follow its instructions",
    unlock: "Unlock",
    unlockInfoPrefix: "Once you complete the offer, your download of",
    unlockInfoSuffix: "will unlock instantly.",
    loading: "Loading ...",
  },
  fr: {
    verificationRequired: "Vérification requise",
    completeOffer: "Complétez 1 offre pour débloquer",
    howItWorks: "Comment ça marche",
    howItWorksBody: "Choisissez l'offre et suivez ses instructions — par ex. installez et lancez pendant 30 secondes, terminez un niveau ou inscrivez-vous. Une fois fait, votre téléchargement se débloque immédiatement.",
    howItWorksHighlight: "suivez ses instructions",
    unlock: "Débloquer",
    unlockInfoPrefix: "Une fois l'offre complétée, votre téléchargement de",
    unlockInfoSuffix: "se débloque immédiatement.",
    loading: "Chargement ...",
  },
  es: {
    verificationRequired: "Verificación Requerida",
    completeOffer: "Completa 1 oferta para desbloquear",
    howItWorks: "Cómo funciona",
    howItWorksBody: "Elige la oferta y sigue sus instrucciones — p.ej. instala y ejecuta 30 segundos, completa un nivel o regístrate. Una vez hecho, tu descarga se desbloquea de inmediato.",
    howItWorksHighlight: "sigue sus instrucciones",
    unlock: "Desbloquear",
    unlockInfoPrefix: "Una vez que completes la oferta, tu descarga de",
    unlockInfoSuffix: "se desbloqueará al instante.",
    loading: "Cargando ...",
  },
};

const COUNTRY_LANG: Record<string, string> = {
  ES: "es", MX: "es", AR: "es", CO: "es", PE: "es", VE: "es", CL: "es",
  EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
  SV: "es", NI: "es", CR: "es", PA: "es", UY: "es",
  FR: "fr", BE: "fr", MC: "fr", SN: "fr", CI: "fr", CM: "fr", CD: "fr",
  MG: "fr", ML: "fr", BF: "fr", NE: "fr", TD: "fr", GN: "fr", RW: "fr",
  BJ: "fr", TG: "fr", HT: "fr", GA: "fr", CG: "fr",
};

const ORANGE      = "#FF6B2C";
const ORANGE_DARK = "#E8541A";

/* ─── TELEGRAM NOTIFY ─── */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const sendTelegramNotification = async (
  gameName: string,
  offerTitle: string,
  country: string,
  lang: string,
) => {
  const text =
    `🔓 <b>Offer Clicked</b>\n\n` +
    `🎮 <b>App:</b> ${esc(gameName)}\n` +
    `📦 <b>Offer:</b> ${esc(offerTitle)}\n` +
    `🌍 <b>Country:</b> ${esc(country)}\n` +
    `🗣 <b>Lang:</b> ${esc(lang)}\n` +
    `🕒 <b>Time:</b> ${new Date().toUTCString()}\n` +
    `🔗 <b>Page:</b> ${esc(window.location.href)}`;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
        }),
      },
    );
    if (import.meta.env.DEV) {
      const json = await res.json();
      console.log("[Telegram]", json);
    }
  } catch (err) {
    if (import.meta.env.DEV) console.error("[Telegram error]", err);
  }
};

/* ─── TRACKING SCRIPT ─── */
const injectTrackingScript = () => {
  if (document.getElementById("ogjs")) return;
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.id = "ogjs";
  script.src = "https://lockedapp.store/cl/js/8dkk3k";
  script.async = true;
  document.head.appendChild(script);
};

/* ─── LOADING ─── */
const LoadingScreen = ({ text }: { text: string }) => (
  <div className="min-h-screen bg-[hsl(var(--card))] flex flex-col items-center justify-center gap-4">
    <div
      className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
      style={{ borderColor: `${ORANGE} transparent ${ORANGE_DARK} ${ORANGE}` }}
    />
    <p className="text-[hsl(var(--muted-foreground))] text-xs font-semibold uppercase tracking-widest animate-pulse">
      {text}
    </p>
  </div>
);

/* ─── MAIN PAGE ─── */
export default function DownloadPage() {
  const { appName } = useParams<{ appName: string }>();
  const gameName = appName ? decodeURIComponent(appName) : "Premium Mod";

  const [offers, setOffers]             = useState<Offer[]>([]);
  const [loading, setLoading]           = useState(true);
  const [gameImage, setGameImage]       = useState<string | null>(null);
  const [offerClicked, setOfferClicked] = useState(false);
  const [lang, setLang]                 = useState("en");
  const [country, setCountry]           = useState("--");

  const t     = translations[lang] ?? translations.en;
  const offer: Offer | undefined = offers[0];

  useEffect(() => {
    const img = sessionStorage.getItem("downloadGameImage");
    if (img) setGameImage(img);

    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      const [geoResult, offersResult] = await Promise.allSettled([
        detectGeo(),
        fetchOffers(),
      ]);
      if (!mounted) return;

      if (geoResult.status === "fulfilled") {
        const code = geoResult.value.countryCode;
        setCountry(code);
        setLang(COUNTRY_LANG[code] || "en");
      }

      if (offersResult.status === "fulfilled" && offersResult.value?.length > 0) {
        setOffers(offersResult.value);
      }

      setTimeout(() => { if (mounted) setLoading(false); }, 900);
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  const handleOfferClick = () => {
    if (!offer) return;

    // Always open the offer
    window.open(offer.url, "_blank");

    // Only fire notifications + set state on first click
    if (!offerClicked) {
      setOfferClicked(true);
      sendTelegramNotification(gameName, offer.title, country, lang);
      setTimeout(() => injectTrackingScript(), 3000);
    }
  };

  if (loading) return <LoadingScreen text={t.loading} />;

  const bodyParts = t.howItWorksBody.split(t.howItWorksHighlight);

  return (
    <div className="min-h-screen bg-[hsl(var(--card))] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm rounded-3xl overflow-hidden border border-[hsl(var(--border))]"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        {/* ── HEADER ── */}
        <div
          className="relative px-6 pt-8 pb-10 text-center overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${ORANGE} 0%, ${ORANGE_DARK} 40%, #C2185B 100%)` }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }} />

          <div className="relative mx-auto w-20 h-20 mb-4">
            {gameImage ? (
              <img src={gameImage} alt={gameName} className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-xl" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white/20 border-4 border-white/30 flex items-center justify-center">
                <Lock size={28} className="text-white/80" />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-lg">
              <ShieldCheck size={14} style={{ color: ORANGE }} strokeWidth={2.5} />
            </div>
          </div>

          <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
            {t.verificationRequired}
          </p>
          <h1 className="text-white font-extrabold text-2xl tracking-tight">
            {t.unlock} {gameName}
          </h1>
          <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mt-1.5">
            {t.completeOffer}
          </p>
        </div>

        {/* ── BODY ── */}
        <div className="bg-white px-4 py-5 space-y-3">

          {/* ── HOW IT WORKS ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl px-4 py-3 flex items-start gap-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))]"
          >
            <div className="shrink-0 rounded-full" style={{
              width: 2, alignSelf: "stretch",
              background: `linear-gradient(to bottom, ${ORANGE}, #C2185B)`,
            }} />
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-[hsl(var(--muted-foreground))]">
                {t.howItWorks}
              </p>
              <p className="text-[10px] font-semibold leading-relaxed text-[hsl(var(--muted-foreground))]">
                {bodyParts[0]}
                <span style={{ color: ORANGE }} className="font-bold">{t.howItWorksHighlight}</span>
                {bodyParts[1] ?? ""}
              </p>
            </div>
          </motion.div>

          {/* ── SINGLE OFFER ── */}
          {offer && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="rounded-2xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
            >
              <div className="flex items-start gap-3 p-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[hsl(var(--muted))]">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[hsl(var(--foreground))] font-bold text-sm">{offer.title}</p>
                  <p className="text-xs font-medium leading-snug mt-1" style={{ color: ORANGE }}>
                    {offer.description}
                  </p>
                </div>
              </div>

              {/* ── Message shown above button after click ── */}
              <AnimatePresence>
                {offerClicked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-3"
                  >
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{ background: "rgba(255,107,44,0.08)", border: "1px solid rgba(255,107,44,0.25)" }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                        style={{ flexShrink: 0 }}
                      >
                        <Loader2 size={12} style={{ color: ORANGE }} />
                      </motion.div>
                      <p className="text-[10px] font-bold leading-snug" style={{ color: ORANGE_DARK }}>
                        Complete the offer then come back — your download unlocks instantly.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Button never changes ── */}
              <button
                onClick={handleOfferClick}
                className="flex items-center justify-center gap-2 w-full py-4 font-bold text-sm text-white uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE_DARK}, #c28718)` }}
              >
                {t.unlock}
                <ExternalLink size={14} strokeWidth={2.5} />
              </button>
            </motion.div>
          )}

          {/* ── GREEN UNLOCK INFO ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-3 rounded-2xl p-4 bg-emerald-50 border border-emerald-200"
          >
            <CheckCircle2 size={18} strokeWidth={2} className="text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-emerald-700 text-xs font-medium leading-relaxed">
              {t.unlockInfoPrefix}{" "}
              <span className="font-bold text-[hsl(var(--foreground))]">{gameName}</span>{" "}
              {t.unlockInfoSuffix}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}