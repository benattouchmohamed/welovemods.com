'use client';

import React, { useEffect, useState, memo, lazy, Suspense } from "react";
import { Clock, DollarSign, Smartphone, Monitor, Gamepad2, Gift, Star, X, QrCode, Copy, Check } from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";
import QRCode from "qrcode";
import CountryDetected from "@/components/CountryDetected";
/* ────────────────────── AUTO-COPY TOAST ────────────────────── */
const AutoCopyScript = memo(() => {
  const time = new Date().toLocaleString("en-GB", { timeZone: "Africa/Casablanca" });
  useEffect(() => {
    const handleCopy = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        navigator.clipboard.writeText(`boasted from Download Page – ${time} (Morocco)`);
        const toast = Object.assign(document.createElement("div"), {
          textContent: "Copied!",
          className:
            "fixed bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg z-50 animate-bounce",
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
/* ────────────────────── GLOBAL STYLES ────────────────────── */
const NoSelectStyle = () => (
  <style jsx global>{`
    .no-select * { user-select: none !important; }
    .no-select.selectable * { user-select: auto !important; }
    @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    .animate-shimmer {
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
  `}</style>
);
/* Lazy Components */
const LangPicker = lazy(() => import("./LangPicker"));
// const SupportNote = lazy(() => import("./SupportNote"));
/* ────────────────────── SKELETONS ────────────────────── */
const HeaderSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-gray-200 p-6">
    <div className="h-7 animate-shimmer rounded mx-auto w-3/4 mb-2" />
    <div className="h-5 animate-shimmer rounded mx-auto w-1/2" />
  </div>
);
const OfferSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-200 shadow-sm">
    <div className="flex gap-3">
      <div className="w-14 h-14 animate-shimmer rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 animate-shimmer rounded w-3/4" />
        <div className="h-3 animate-shimmer rounded w-full" />
        <div className="h-3 animate-shimmer rounded w-5/6" />
        <div className="h-9 animate-shimmer rounded-lg mt-3" />
      </div>
    </div>
  </div>
);
/* ────────────────────── QR CODE MODAL ────────────────────── */
const QRModal = memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [locale] = useLocale();
  const i18n = t(locale);
  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(window.location.href, { width: 256, margin: 2, color: { dark: "#1f2937", light: "#fff" } }).then(setQrUrl);
    }
  }, [isOpen]);
  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
        <QrCode className="w-10 h-10 mx-auto mb-3 text-emerald-600" />
        <h3 className="text-xl font-black text-gray-800 mb-2">{i18n.scanOnMobile ?? "Scan on Mobile"}</h3>
        <p className="text-sm text-gray-600 mb-5">{i18n.completeOnPhone ?? "Please complete verification on your mobile"}</p>
        {qrUrl ? (
          <div className="bg-white p-3 rounded-xl shadow-inner mx-auto inline-block">
            <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
          </div>
        ) : (
          <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
            <QrCode className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="mt-5 flex items-center justify-center gap-2">
          <button onClick={copyUrl} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-200 transition">
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? (i18n.copied ?? "Copied!") : (i18n.copyUrl ?? "Copy URL")}
          </button>
        </div>
      </div>
    </div>
  );
});
/* ────────────────────── OFFER MODAL ────────────────────── */
const OfferModal = memo(({ offer, onClose }: { offer: Offer | null; onClose: () => void }) => {
  const [locale] = useLocale();
  const i18n = t(locale);
  if (!offer) return null;
  const icons: Record<string, JSX.Element> = {
    Smartphone: <Smartphone className="w-10 h-10 text-yellow-100" />,
    Monitor: <Monitor className="w-10 h-10 text-yellow-100" />,
    Gamepad2: <Gamepad2 className="w-10 h-10 text-yellow-100" />,
    Gift: <Gift className="w-10 h-10 text-yellow-100" />,
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-green-500/30" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
        <div className="flex justify-center mb-5">
          <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 p-3 shadow-lg flex items-center justify-center">
            {offer.image ? (
              <img src={offer.image} alt={offer.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              icons[offer.icon] || <DollarSign className="w-10 h-10 text-yellow-100" />
            )}
          </div>
        </div>
        <h3 className="text-2xl font-black text-center text-blue-600 mb-3">{offer.title}</h3>
        <p className="text-sm text-gray-600 text-center mb-6 line-clamp-3">{offer.description}</p>
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
          className="
            block text-center py-3.5 rounded-xl font-black text-white
            bg-gradient-to-r from-green-500 to-emerald-600
            shadow-lg
            hover:shadow-xl hover:brightness-110
            active:scale-95
            transition-all duration-200
          "
        >
          {i18n.completeNow ?? "Complete Now"}
        </a>
      </div>
    </div>
  );
});
/* ────────────────────── OFFER CARD ────────────────────── */
const OfferCard = memo(({ o, i, onOpenModal, topOfferId }: { o: Offer; i: number; onOpenModal: (o: Offer) => void; topOfferId: string | null }) => {
  const [locale] = useLocale();
  const i18n = t(locale);
  const icons: Record<string, JSX.Element> = {
    Smartphone: <Smartphone className="w-5 h-5 text-yellow-100" />,
    Monitor: <Monitor className="w-5 h-5 text-yellow-100" />,
    Gamepad2: <Gamepad2 className="w-5 h-5 text-yellow-100" />,
    Gift: <Gift className="w-5 h-5 text-yellow-100" />,
  };
  const isRecommended = topOfferId === o.id;
  return (
    <article className={`bg-white rounded-xl p-3.5 border-2 shadow hover:shadow-lg transition-all duration-200 ${i % 2 === 0 ? "border-purple-400" : "border-pink-400"} ${isRecommended ? "ring-4 ring-yellow-400 ring-offset-2" : ""}`}>
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 p-1.5 flex-shrink-0 shadow-sm flex items-center justify-center">
          {o.image ? (
            <img src={o.image} alt={o.title} className="w-full h-full object-cover rounded" loading="lazy" />
          ) : (
            icons[o.icon] || <DollarSign className="w-5 h-5 text-yellow-100" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-black text-sm text-blue-600 line-clamp-2 mb-1 ${isRecommended ? "text-lg" : ""}`}>{o.title}</h3>
          {isRecommended && (
            <span className="inline-block text-xs font-bold text-yellow-700 bg-yellow-200 px-2 py-0.5 rounded-full animate-pulse mb-1">
              {i18n.recommended ?? "Recommended"}
            </span>
          )}
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">{o.description}</p>
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
            className={`
              w-full py-2.5 px-4
              rounded-xl text-sm font-bold
              text-white tracking-wide
              transition-all duration-200 active:scale-95
              ${isRecommended
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 shadow-md hover:shadow-lg hover:brightness-110"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 shadow hover:shadow-md hover:brightness-110"
              }
            `}
          >
            {i18n.completeOfferBtn ?? "Complete Offer"}
          </button>
         
        </div>
      </div>
    </article>
  );
});
/* ────────────────────── CONFIRM EXIT ────────────────────── */
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
/* ────────────────────── SERVER 2 FULLSCREEN ────────────────────── */
type TryServer2Props = { defaultOpen?: boolean };
const TryServer2Fullscreen = memo(({ defaultOpen = false }: TryServer2Props) => {
  // Default NOT OPEN
  const [open, setOpen] = useState<boolean>(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [locale] = useLocale();
  const i18n = t(locale);
  // If defaultOpen changes from false -> true while mounted, open it
  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="
          mx-auto block
          px-4 py-2 rounded-lg
          text-yellow-600 underline text-sm font-semibold
          transition hover:text-blue-700
        "
      >
        {i18n.tryServer2 ?? "Server 2"}
      </button>
    );
  }
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fadeIn">
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg">
        <h3 className="text-sm font-black">Server 2</h3>
        <div className="flex gap-2">
          <button
            onClick={() =>
              window.open("https://appinstallcheck.com/cl/i/8dkk3k", "_blank", "noopener,noreferrer")
            }
            className="p-1 rounded-full hover:bg-white/20 transition"
            title="Open in new tab"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      {!iframeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <iframe
        src="https://appinstallcheck.com/cl/i/8dkk3k"
        title="Server 2"
        className="flex-1 w-full"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setIframeReady(true)}
      />
    </div>
  );
});
/* ────────────────────── MAIN DOWNLOAD PAGE ────────────────────── */
const Download = () => {
  const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const gameName = urlParams.get("game") || "Game";
  const gameImage = typeof window !== "undefined" ? sessionStorage.getItem("downloadGameImage") ?? null : null;
  const [locale] = useLocale();
  const i18n = t(locale);
  const [showServer2, setShowServer2] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [modalOffer, setModalOffer] = useState<Offer | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useConfirmExit();
  // Desktop detection
  useEffect(() => {
    const check = () => {
      const desktop = !/Mobi|Android|iPhone/i.test(navigator.userAgent) && window.innerWidth > 768;
      setIsDesktop(desktop);
      if (desktop) setShowQR(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  // Scroll no-select
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => setIsScrolling(false), 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Fetch & sort offers
  useEffect(() => {
    let mounted = true;
    fetchOffers()
      .then((data) => {
        if (mounted) {
          const sorted = [...data].sort((a, b) => (b.epc ?? 0) - (a.epc ?? 0));
          setOffers(sorted);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);
  const openModal = (o: Offer) => setModalOffer(o);
  const closeModal = () => setModalOffer(null);
  const topTwo = offers.slice(0, 2);
  const remaining = offers.slice(2);
  const bestOfferId = offers[0]?.id || null;

  return (
    <>
      {/* COUNTRY DETECTION RUNS FIRST - PH & ID GO TO /adblue */}
      <CountryDetected />

      <AutoCopyScript />
      <NoSelectStyle />

      <div dir={locale === "ar" ? "rtl" : "ltr"} className={`min-h-screen bg-gradient-to-b from-yellow-50/50 to-white ${isScrolling ? "no-select" : "no-select selectable"}`}>
        <main className="pt-4 pb-10">
          <div className="max-w-xl mx-auto px-4">

            {/* Loading */}
            {loading && (
              <div className="space-y-4">
                <HeaderSkeleton />
                <div className="flex justify-center my-2"><div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse" /></div>
                <OfferSkeleton /><OfferSkeleton />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-center py-12 space-y-4">
                <p className="text-red-600 font-bold">{i18n.error}</p>
                {/* in error state show the TryServer2 button (not open by default) */}
                <TryServer2Fullscreen />
              </div>
            )}

            {/* Success */}
            {!loading && !error && offers.length > 0 && (
              <>
                <section className="bg-white rounded-2xl shadow-lg border-2 border-green-500/50 p-5 mb-5 text-center">
                  <h1 className="text-2xl font-black text-blue-600 mb-2">{i18n.completeOneTask ?? "Complete one task"}</h1>
                {/* {gameImage && (
  <img
    src={gameImage}
    alt={gameName}
    className="mx-auto my-3 w-20 h-20 rounded-xl object-cover shadow shadow-black/40"
  />
)} */}

                  <p className="text-lg font-bold text-green-600 mb-4">
                    {(i18n.gameReady ?? "Game {game} is ready").split("{game}")[0]}
                     <span className="text-yellow-500 underline text-xl">{gameName}</span><br />
                    {(i18n.gameReady ?? "Game {game} is ready").split("{game}")[1]}
                  </p>
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <Suspense fallback={null}>
                      <LangPicker />
                    </Suspense>

<div><TryServer2Fullscreen />
</div>
                  

                  </div>

                
                </section>

                {/* Top 2 Offers */}
                <div className="space-y-4 mb-6">
                  {topTwo.map((o, i) => (
                    <OfferCard key={o.id} o={o} i={i} onOpenModal={openModal} topOfferId={bestOfferId} />
                  ))}
                </div>

                {/* <Suspense fallback={null}>
                  <SupportNote />
                </Suspense> */}

                {remaining.length > 0 && (
                  <div className="text-center my-6 text-xs font-bold text-gray-500">
                    — {i18n.tryOffers ?? "Más ofertas"} —
                  </div>
                )}

                <div className="grid gap-4">
                  {remaining.map((o, i) => (
                    <OfferCard key={o.id} o={o} i={i + 2} onOpenModal={openModal} topOfferId={bestOfferId} />
                  ))}
                </div>
              </>
            )}

            {/* No offers */}
            {!loading && !error && offers.length === 0 && (
              <div className="text-center py-12">
                <TryServer2Fullscreen />
              </div>
            )}
          </div>
        </main>
      </div>

      <OfferModal offer={modalOffer} onClose={closeModal} />
      {isDesktop && (
       <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
  <button
    onClick={() => setShowQR(true)}
    className="
      py-2 px-4
      border border-blue-600
      text-yellow-600
      font-bold
      rounded-full
      shadow-lg
      hover:bg-blue-50
      transition
    "
  >
    {i18n.useMobileFaster ?? "Use this on mobile, it's faster"}
  </button>
</div>

      )}
      <QRModal isOpen={showQR && isDesktop === true} onClose={() => setShowQR(false)} />
    </>
  );
};

export default Download;