import React, { useEffect, useState } from "react";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

/* ─────────────────────────────────────────────
   TRANSLATIONS
───────────────────────────────────────────── */
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
    howItWorksBody: "Pick any offer below and follow its instructions — e.g. install and run for 30 seconds, complete a level, or sign up. Once done, your download unlocks immediately.",
    howItWorksHighlight: "follow its instructions",
    unlock: "Unlock",
    unlockInfoPrefix: "Once you complete an offer, your download of",
    unlockInfoSuffix: "will unlock instantly.",
    loading: "Loading ...",
  },
  es: {
    verificationRequired: "Verificación Requerida",
    completeOffer: "Completa 1 oferta para desbloquear",
    howItWorks: "Cómo funciona",
    howItWorksBody: "Elige cualquier oferta y sigue sus instrucciones — p.ej. instala y ejecuta 30 segundos, completa un nivel o regístrate. Una vez hecho, tu descarga se desbloquea de inmediato.",
    howItWorksHighlight: "sigue sus instrucciones",
    unlock: "Desbloquear",
    unlockInfoPrefix: "Una vez que completes una oferta, tu descarga de",
    unlockInfoSuffix: "se desbloqueará al instante.",
    loading: "Cargando ...",
  },
  de: {
    verificationRequired: "Verifizierung erforderlich",
    completeOffer: "1 Angebot abschließen zum Freischalten",
    howItWorks: "So funktioniert es",
    howItWorksBody: "Wähle ein Angebot und folge den Anweisungen — z.B. App installieren und 30 Sekunden nutzen, ein Level abschließen oder registrieren. Danach wird dein Download sofort freigeschaltet.",
    howItWorksHighlight: "folge den Anweisungen",
    unlock: "Freischalten",
    unlockInfoPrefix: "Sobald du ein Angebot abgeschlossen hast, wird dein Download von",
    unlockInfoSuffix: "sofort freigeschaltet.",
    loading: "Laden ...",
  },
  ar: {
    verificationRequired: "التحقق مطلوب",
    completeOffer: "أكمل عرضاً واحداً للفتح",
    howItWorks: "كيف يعمل",
    howItWorksBody: "اختر أي عرض واتبع تعليماته — مثلاً: ثبّت التطبيق وشغّله 30 ثانية، أو أكمل مستوى، أو سجّل. بعد الانتهاء، يُفتح تنزيلك فوراً.",
    howItWorksHighlight: "اتبع تعليماته",
    unlock: "فتح",
    unlockInfoPrefix: "بمجرد إكمال العرض، سيُفتح تنزيل",
    unlockInfoSuffix: "فوراً.",
    loading: "جار التحميل ...",
  },
  fr: {
    verificationRequired: "Vérification requise",
    completeOffer: "Complétez 1 offre pour débloquer",
    howItWorks: "Comment ça marche",
    howItWorksBody: "Choisissez une offre et suivez ses instructions — par ex. installez et lancez pendant 30 secondes, terminez un niveau ou inscrivez-vous. Une fois fait, votre téléchargement se débloque immédiatement.",
    howItWorksHighlight: "suivez ses instructions",
    unlock: "Débloquer",
    unlockInfoPrefix: "Une fois une offre complétée, votre téléchargement de",
    unlockInfoSuffix: "se débloque immédiatement.",
    loading: "Chargement ...",
  },
};

// Country code → language
const COUNTRY_LANG: Record<string, string> = {
  // Spanish
  ES: "es", MX: "es", AR: "es", CO: "es", PE: "es", VE: "es", CL: "es",
  EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
  SV: "es", NI: "es", CR: "es", PA: "es", UY: "es",
  // German
  DE: "de", AT: "de",
  // Arabic
  SA: "ar", AE: "ar", EG: "ar", IQ: "ar", JO: "ar", KW: "ar",
  LB: "ar", LY: "ar", MA: "ar", OM: "ar", QA: "ar", SY: "ar", TN: "ar", YE: "ar",
  // French
  FR: "fr", BE: "fr", MC: "fr", SN: "fr", CI: "fr", CM: "fr", DZ: "fr",
};

async function detectLang(): Promise<string> {
  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(4000),
    });
    const data = await res.json();
    const country = (data.country_code || "").toUpperCase();
    return COUNTRY_LANG[country] || "en";
  } catch {
    return "en";
  }
}

/* ─────────────────────────────────────────────
   TRACKING
───────────────────────────────────────────── */
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
   LOADING SCREEN
───────────────────────────────────────────── */
const LoadingScreen = ({ text }: { text: string }) => (
  <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center gap-4">
    <div
      className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
      style={{ borderColor: "#FF6B2C transparent #ff8400 #FF6B2C" }}
    />
    <p className="text-white/60 text-xs font-semibold uppercase tracking-widest animate-pulse">
      {text}
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
  const [offerClicked, setOfferClicked] = useState(false);
  const [lang, setLang] = useState("en");

  const t = translations[lang] ?? translations.en;
  const isRTL = lang === "ar";

  useEffect(() => {
    const img = sessionStorage.getItem("downloadGameImage");
    if (img) setGameImage(img);

    let mounted = true;

    const loadData = async () => {
      setLoading(true);

      // Fetch lang detection + offers in parallel
      const [langResult, offersResult] = await Promise.allSettled([
        detectLang(),
        fetchOffers(),
      ]);

      if (!mounted) return;

      if (langResult.status === "fulfilled") setLang(langResult.value);
      if (offersResult.status === "fulfilled" && offersResult.value?.length > 0) {
        setOffers(offersResult.value); // ALL offers, no slice
      }

      setTimeout(() => { if (mounted) setLoading(false); }, 900);
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  const handleOfferClick = (offerUrl: string) => {
    if (offerClicked) return;
    setOfferClicked(true);
    setTimeout(() => injectTrackingScript(), 3000);
    window.open(offerUrl, "_blank");
    window.location.href = `/game/${encodeURIComponent(gameName)}`;
  };

  if (loading) return <LoadingScreen text={t.loading} />;

  // Split body text around the highlighted phrase
  const bodyParts = t.howItWorksBody.split(t.howItWorksHighlight);

  return (
    <div
      className="min-h-screen bg-[#111] flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
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
          <div className="relative mx-auto w-20 h-20 mb-4">
            <img
              src={gameImage || "/placeholder.svg"}
              alt={gameName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-xl"
            />
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
        <div className="bg-[#1a1a1a] px-4 py-5 space-y-3">

          {/* ── HOW IT WORKS ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl px-4 py-3 flex items-start gap-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="shrink-0 rounded-full"
              style={{
                width: 2,
                alignSelf: "stretch",
                background: "linear-gradient(to bottom, #FF6B2C, #C2185B)",
              }}
            />
            <div>
              <p
                className="text-[9px] font-black uppercase tracking-[0.2em] mb-1"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {t.howItWorks}
              </p>
              <p
                className="text-[10px] font-semibold leading-relaxed"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {bodyParts[0]}
                <span style={{ color: "#fbbf24" }}>{t.howItWorksHighlight}</span>
                {bodyParts[1] ?? ""}
              </p>
            </div>
          </motion.div>

          {/* ── OFFERS — ALL, full description, no truncation ── */}
          {offers.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.08 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "#242424" }}
            >
              <div className="flex items-start gap-3 p-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#333]">
                  <img src={o.image} alt={o.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">{o.title}</p>
                  {/* Full description — no line-clamp */}
                  <p
                    className="text-xs font-medium leading-snug mt-1"
                    style={{ color: "#FF6B2C" }}
                  >
                    {o.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleOfferClick(o.url)}
                className="flex items-center justify-center gap-2 w-full py-4 font-bold text-sm text-white uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: "linear-gradient(90deg, #ff9d2c, #E8541A, #c28718)" }}
              >
                {t.unlock}
                <ExternalLink size={14} strokeWidth={2.5} />
              </button>
            </motion.div>
          ))}

          {/* ── GREEN UNLOCK INFO ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 rounded-2xl p-4"
            style={{
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.25)",
            }}
          >
            <CheckCircle2 size={18} strokeWidth={2} className="text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-emerald-300 text-xs font-medium leading-relaxed">
              {t.unlockInfoPrefix}{" "}
              <span className="font-bold text-white">{gameName}</span>{" "}
              {t.unlockInfoSuffix}
            </p>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}