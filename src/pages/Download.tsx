import React, { useEffect, useState } from "react"; // v4
import { ExternalLink, ShieldCheck, Lock, Smartphone, ScanLine, CheckCircle2, Globe } from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { detectGeo, isDesktop, type GeoInfo } from "@/services/geoService";
import QRCode from "qrcode";

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
  scanQR: string;
  scanQRDesc: string;
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
    scanQR: "Scan to continue on mobile",
    scanQRDesc: "Complete the verification on your phone for the best experience",
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
    scanQR: "Scannez pour continuer sur mobile",
    scanQRDesc: "Complétez la vérification sur votre téléphone pour la meilleure expérience",
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
    scanQR: "امسح للمتابعة على الهاتف",
    scanQRDesc: "أكمل التحقق على هاتفك للحصول على أفضل تجربة",
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
    scanQR: "Escanea para continuar en el móvil",
    scanQRDesc: "Completa la verificación en tu teléfono para la mejor experiencia",
  },
};

const COUNTRY_LANG: Record<string, string> = {
  ES: "es", MX: "es", AR: "es", CO: "es", PE: "es", VE: "es", CL: "es",
  EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
  SV: "es", NI: "es", CR: "es", PA: "es", UY: "es",
  SA: "ar", AE: "ar", EG: "ar", IQ: "ar", JO: "ar", KW: "ar",
  LB: "ar", LY: "ar", MA: "ar", OM: "ar", QA: "ar", SY: "ar", TN: "ar", YE: "ar",
  DZ: "ar", BH: "ar", SD: "ar", PS: "ar",
  FR: "fr", BE: "fr", MC: "fr", SN: "fr", CI: "fr", CM: "fr", CD: "fr",
  MG: "fr", ML: "fr", BF: "fr", NE: "fr", TD: "fr", GN: "fr", RW: "fr",
  BJ: "fr", TG: "fr", HT: "fr", GA: "fr", CG: "fr",
};

const ORANGE = "#FF6B2C";
const ORANGE_DARK = "#E8541A";

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

/* ─── DESKTOP QR VIEW ─── */
const DesktopQRView = ({ url, t, gameName, gameImage }: {
  url: string;
  t: typeof translations["en"];
  gameName: string;
  gameImage: string | null;
}) => {
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 220, margin: 2,
      color: { dark: "#1a1a2e", light: "#ffffff" },
    }).then(setQrDataUrl).catch(() => {});
  }, [url]);

  return (
    <div className="min-h-screen bg-[hsl(var(--card))] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl overflow-hidden border border-[hsl(var(--border))]"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        {/* Header */}
        <div
          className="relative px-6 pt-8 pb-10 text-center overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${ORANGE} 0%, ${ORANGE_DARK} 40%, #C2185B 100%)` }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }} />
          {gameImage ? (
            <img src={gameImage} alt={gameName} className="relative mx-auto w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-xl mb-4" />
          ) : (
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-white/20 border-4 border-white/30 flex items-center justify-center mb-4">
              <Lock size={28} className="text-white/80" />
            </div>
          )}
          <h1 className="text-white font-extrabold text-2xl tracking-tight">
            {t.unlock} {gameName}
          </h1>
        </div>

        {/* QR Body */}
        <div className="bg-white px-6 py-8 flex flex-col items-center gap-5">
          {qrDataUrl && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="p-4 bg-white rounded-2xl border-2 border-[hsl(var(--border))] shadow-lg"
            >
              <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
            </motion.div>
          )}
          <div className="flex items-center gap-3 text-center">
            <Smartphone size={24} style={{ color: ORANGE }} strokeWidth={2} />
            <div>
              <p className="font-extrabold text-[hsl(var(--foreground))] text-sm">{t.scanQR}</p>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] font-medium mt-0.5">{t.scanQRDesc}</p>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]"
          >
            <ScanLine size={20} style={{ color: ORANGE }} strokeWidth={2.5} />
            <span className="text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">{t.scanQR}</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── MAIN PAGE ─── */
export default function DownloadPage() {
  const { appName } = useParams<{ appName: string }>();
  const gameName = appName ? decodeURIComponent(appName) : "Premium Mod";

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameImage, setGameImage] = useState<string | null>(null);
  const [offerClicked, setOfferClicked] = useState(false);
  const [lang, setLang] = useState("en");
  const [onDesktop, setOnDesktop] = useState(false);

  const t = translations[lang] ?? translations.en;
  const isRTL = lang === "ar";

  useEffect(() => {
    const img = sessionStorage.getItem("downloadGameImage");
    if (img) setGameImage(img);
    setOnDesktop(isDesktop());

    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      const [geoResult, offersResult] = await Promise.allSettled([
        detectGeo(),
        fetchOffers(),
      ]);
      if (!mounted) return;

      if (geoResult.status === "fulfilled") {
        const detectedLang = COUNTRY_LANG[geoResult.value.countryCode] || "en";
        setLang(detectedLang);
      }

      if (offersResult.status === "fulfilled" && offersResult.value?.length > 0) {
        setOffers(offersResult.value);
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

  if (onDesktop) {
    // Build a clean URL without any internal tokens
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    return <DesktopQRView url={cleanUrl} t={t} gameName={gameName} gameImage={gameImage} />;
  }

  const bodyParts = t.howItWorksBody.split(t.howItWorksHighlight);

  return (
    <div className="min-h-screen bg-[hsl(var(--card))] flex items-center justify-center p-4" dir={isRTL ? "rtl" : "ltr"}>
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

          {/* ── OFFERS ── */}
          {offers.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.08 }}
              className="rounded-2xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
            >
              <div className="flex items-start gap-3 p-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[hsl(var(--muted))]">
                  <img src={o.image} alt={o.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[hsl(var(--foreground))] font-bold text-sm">{o.title}</p>
                  <p className="text-xs font-medium leading-snug mt-1" style={{ color: ORANGE }}>
                    {o.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleOfferClick(o.url)}
                className="flex items-center justify-center gap-2 w-full py-4 font-bold text-sm text-white uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE_DARK}, #c28718)` }}
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
