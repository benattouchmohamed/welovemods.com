'use client';

import React, { useEffect, useState, memo, lazy, Suspense } from "react";
import { Clock, DollarSign, Smartphone, Monitor, Gamepad2, Gift, Star, X, QrCode, Copy, Check, Crown } from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";
import QRCode from "qrcode";

/* ────────────────────── TIKTOK DETECTION (Très fiable) ────────────────────── */
const isTikTokBrowser = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();

  const tiktokKeywords = [
    "tiktok", "musical_ly", "musically", "zhiliaoapp",
    "com.zhiliaoapp.musically", "com.ss.android.ugc.aweme"
  ];

  const hasKeyword = tiktokKeywords.some(kw => ua.includes(kw));
  const hasTikTokProp = !!(window as any).TikTokWebView || !!(window as any).webkit?.messageHandlers?.TikTok;

  return hasKeyword || hasTikTokProp;
};

/* ────────────────────── TIKTOK BLOCKER (Seulement si détecté) ────────────────────── */
const TikTokBlocker = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center animate-pulse">
        <img
          src="https://www9.0zz0.com/2024/04/06/13/548511907.gif"
          alt="Open in real browser"
          className="w-full max-w-xs mx-auto rounded-2xl border-8 border-black shadow-2xl"
        />
        <h1 className="mt-8 text-4xl font-black text-gray-800">
          Ouvre dans ton navigateur !
        </h1>
        <p className="mt-4 text-xl font-bold text-gray-700">
          TikTok bloque le téléchargement<br />
          Clique sur <span className="text-blue-600">⋯</span> → "Ouvrir dans le navigateur"
        </p>
      </div>
    </div>
  );
};

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
          className: "fixed bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl z-50 animate-bounce",
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
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
    @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    .animate-shimmer { background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
    @keyframes float { 0% { transform: translateY(0) rotate(-10deg); } 50% { transform: translateY(-12px) rotate(10deg); } 100% { transform: translateY(0) rotate(-10deg); } }
    .crown-float { animation: float 6s ease-in-out infinite; }
    :root { --custom-background-color: rgb(0, 170, 255); }
    .custom-ocean-bg { background-color: var(--custom-background-color) !important; }
  `}</style>
);

/* Lazy Components */
const LangPicker = lazy(() => import("./LangPicker"));

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
          className="block text-center py-3.5 rounded-xl font-black text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all duration-200"
        >
          {i18n.completeNow ?? "Complete Now"}
        </a>
      </div>
    </div>
  );
});

/* ────────────────────── TOP OFFER CARD ────────────────────── */
const TopOfferCard = memo(({ o, onOpenModal }: { o: Offer; onOpenModal: (o: Offer) => void }) => {
  const [locale] = useLocale();
  const i18n = t(locale);

  return (
    <article className="relative bg-white rounded-xl p-3.5 border-4 border-yellow-400 shadow-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-50 opacity-70 group-hover:opacity-90 transition-opacity" />
      <div className="absolute -top-3 -right-3 opacity-40 pointer-events-none">
        <Crown className="w-16 h-16 text-yellow-600 crown-float" />
      </div>

      <div className="relative flex gap-3">
        <div className="relative w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-1.5 flex-shrink-0 shadow-lg ring-4 ring-yellow-300 ring-opacity-50">
          {o.image ? (
            <img src={o.image} alt={o.title} className="w-full h-full object-cover rounded-md" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-white/30 rounded-md flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-bold text-amber-700 bg-yellow-200 px-2.5 py-0.5 rounded-full">
              {i18n.recommended ?? "Recommended"}
            </span>
          </div>

          <h3 className="font-black text-base text-blue-600 line-clamp-2 leading-tight">{o.title}</h3>
          <p className="text-xs text-gray-600 line-clamp-2 mt-1 mb-2">{o.description}</p>

          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-blue-600">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-bold">{o.timeEstimate}</span>
              </div>
              <span className="font-bold text-green-600">{o.difficulty}</span>
            </div>
            <div className="flex gap-0.5">
              {Array(5).fill(null).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenModal(o)}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            {i18n.completeOfferBtn ?? "Complete Offer"}
          </button>
        </div>
      </div>
    </article>
  );
});

/* ────────────────────── REGULAR OFFER CARD ────────────────────── */
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

  if (isRecommended) return <TopOfferCard o={o} onOpenModal={onOpenModal} />;

  return (
    <article className="relative bg-white rounded-xl p-3.5 border-4 border-orange-400 shadow-xl overflow-hidden group">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 p-1.5 flex-shrink-0 shadow-sm flex items-center justify-center">
          {o.image ? (
            <img src={o.image} alt={o.title} className="w-full h-full object-cover rounded" loading="lazy" />
          ) : (
            icons[o.icon] || <DollarSign className="w-5 h-5 text-yellow-100" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-sm text-blue-600 line-clamp-2 mb-1">{o.title}</h3>
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
            className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            {i18n.completeOfferBtn ?? "Complete Offer"}
          </button>
        </div>
      </div>
    </article>
  );
});

/* ────────────────────── SERVER 2 FULLSCREEN ────────────────────── */
const TryServer2Fullscreen = memo(({ defaultOpen = false }: { defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [iframeReady, setIframeReady] = useState(false);
  const [locale] = useLocale();
  const i18n = t(locale);

  useEffect(() => { if (defaultOpen) setOpen(true); }, [defaultOpen]);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mx-auto block px-4 py-2 rounded-lg text-yellow-600 underline text-sm font-semibold hover:text-blue-700 transition">
        {i18n.tryServer2 ?? "Server 2"}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fadeIn">
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg">
        <h3 className="text-sm font-black">Server 2</h3>
        <div className="flex gap-2">
          <button onClick={() => window.open("https://appinstallcheck.com/cl/i/8dkk3k", "_blank", "noopener,noreferrer")} className="p-1 rounded-full hover:bg-white/20 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
          <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-white/20 transition">
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

/* ────────────────────── MAIN COMPONENT ────────────────────── */
const Download = () => {
  const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const gameName = urlParams.get("game") || "Game";

  const [locale] = useLocale();
  const i18n = t(locale);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [modalOffer, setModalOffer] = useState<Offer | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [isTikTok, setIsTikTok] = useState<boolean | null>(null);

// TikTok detection
  useEffect(() => {
    setIsTikTok(isTikTokBrowser());
  }, []);

  // Desktop detection
  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth > 768 && !/Mobi|Android|iPhone/i.test(navigator.userAgent);
      setIsDesktop(desktop);
      if (desktop) setShowQR(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Sinon → page normale (aucun changement)
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

  useEffect(() => {
    let mounted = true;
    fetchOffers()
      .then((data) => {
        if (mounted) {
          setOffers(data);
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
  const bestOfferId = offers[0]?.id || null;

  return (
    <>
      <AutoCopyScript />
      <NoSelectStyle />

      <div dir={locale === "ar" ? "rtl" : "ltr"} className={`min-h-screen custom-ocean-bg ${isScrolling ? "no-select" : "no-select selectable"}`}>
        <main className="pt-4 pb-10">
          <div className="max-w-xl mx-auto px-4">
            {loading && (
              <div className="space-y-4">
                <HeaderSkeleton />
                <OfferSkeleton /><OfferSkeleton /><OfferSkeleton />
              </div>
            )}

            {error && (
              <div className="text-center py-12 space-y-4">
                <p className="text-red-600 font-bold">{i18n.error}</p>
                <TryServer2Fullscreen />
              </div>
            )}

            {!loading && !error && offers.length > 0 && (
              <>
                <section className="bg-white rounded-3xl shadow-xl p-6 mb-6 text-center border-2 border-[#D4AF37] hover:border-[#F6E27F] transition-all duration-300">
                  <h1 className="text-2xl font-extrabold text-gray-600 mb-3">
                    {i18n.completeOneTask ?? "Complete one task"}
                  </h1>
                  <p className="text-base font-medium text-green-600 mb-4 leading-relaxed">
                    {(i18n.gameReady ?? "Game {game} is ready").split("{game}")[0]}
                    <span className="text-blue-600 underline text-xl font-bold"> {gameName} </span>
                    <br />
                    {(i18n.gameReady ?? "Game {game} is ready").split("{game}")[1]}
                  </p>
                  <div className="mt-4 flex flex-col items-center gap-3">
                    <Suspense fallback={null}>
                      <LangPicker />
                    </Suspense>
                    <TryServer2Fullscreen />
                  </div>
                </section>

                <div className="space-y-5">
                  {offers.slice(0, 3).map((o, i) => (
                    <OfferCard key={o.id} o={o} i={i} onOpenModal={openModal} topOfferId={bestOfferId} />
                  ))}
                </div>
              </>
            )}

            {!loading && !error && offers.length === 0 && (
              <div className="text-center py-12">
                <TryServer2Fullscreen />
              </div>
            )}
          </div>
        </main>
      </div>

      <OfferModal offer={modalOffer} onClose={() => setModalOffer(null)} />
      <QRModal isOpen={showQR && isDesktop === true} onClose={() => setShowQR(false)} />
    </>
  );
};

export default Download;