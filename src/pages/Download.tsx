'use client';

import React, {
  useEffect,
  useState,
  memo,
  lazy,
  Suspense,
} from "react";
import { useSearchParams } from "react-router-dom";
import {
  Clock,
  DollarSign,
  Smartphone,
  Monitor,
  Gamepad2,
  Gift,
  Star,
  X,
} from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";

/* ──────────────────────  AUTO‑COPY TOAST  ────────────────────── */
const AutoCopyScript = memo(() => {
  const time = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Casablanca",
  });

  useEffect(() => {
    const handleCopy = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        navigator.clipboard.writeText(
          `boasted from Download Page – ${time} (Morocco)`
        );
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

/* ──────────────────────  STYLES  ────────────────────── */
const NoSelectStyle = () => (
  <style jsx global>{`
    .no-select * { user-select: none !important; }
    .no-select.selectable * { user-select: auto !important; }
    @keyframes bounce {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
  `}</style>
);

/* Lazy Components */
const LangPicker = lazy(() => import("./LangPicker"));
const SupportNote = lazy(() => import("./SupportNote"));

/* ──────────────────────  SKELETONS  ────────────────────── */
const HeaderSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 animate-pulse">
    <div className="h-7 bg-gray-300 rounded mx-auto w-3/4 mb-2" />
    <div className="h-5 bg-gray-300 rounded mx-auto w-1/2 mb-4" />
  </div>
);

const OfferSkeleton = () => (
  <div className="bg-white rounded-xl p-3.5 border-2 border-gray-200 animate-pulse">
    <div className="flex gap-3">
      <div className="w-12 h-12 bg-gray-300 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-8 bg-gray-300 rounded-lg mt-3" />
      </div>
    </div>
  </div>
);

/* ──────────────────────  OFFER MODAL  ────────────────────── */
const OfferModal = memo(
  ({ offer, onClose }: { offer: Offer | null; onClose: () => void }) => {
    const i18n = t(useLocale()[0]);
    if (!offer) return null;

    const icons = {
      Smartphone: <Smartphone className="w-10 h-10 text-yellow-100" />,
      Monitor: <Monitor className="w-10 h-10 text-yellow-100" />,
      Gamepad2: <Gamepad2 className="w-10 h-10 text-yellow-100" />,
      Gift: <Gift className="w-10 h-10 text-yellow-100" />,
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-green-500/30"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex justify-center mb-5">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 p-3 shadow-lg flex items-center justify-center">
              {offer.image ? (
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                icons[offer.icon] || <DollarSign className="w-12 h-12 text-yellow-100" />
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
            className="block text-center py-3.5 rounded-xl font-black text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl active:scale-95 transition-all"
          >
            {i18n.completeNow}
          </a>
        </div>
      </div>
    );
  }
);

/* ──────────────────────  OFFER CARD  ────────────────────── */
const OfferCard = memo(
  ({ o, i, onOpenModal }: { o: Offer; i: number; onOpenModal: (o: Offer) => void }) => {
    const i18n = t(useLocale()[0]);
    const icons = {
      Smartphone: <Smartphone className="w-5 h-5 text-yellow-100" />,
      Monitor: <Monitor className="w-5 h-5 text-yellow-100" />,
      Gamepad2: <Gamepad2 className="w-5 h-5 text-yellow-100" />,
      Gift: <Gift className="w-5 h-5 text-yellow-100" />,
    };

    return (
      <article
        className={`
          bg-white rounded-xl p-3.5 border-2 shadow hover:shadow-lg transition-all duration-200
          ${i % 2 === 0 ? "border-purple-400" : "border-pink-400"}
        `}
      >
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
              className="w-full py-2 rounded-lg text-xs font-black text-yellow-100 bg-gradient-to-r from-blue-600 to-purple-600 shadow hover:shadow-md active:scale-95 transition-all"
            >
              {i18n.completeOfferBtn}
            </button>
          </div>
        </div>
      </article>
    );
  }
);

/* ──────────────────────  CONFIRM EXIT  ────────────────────── */
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

/* ──────────────────────  TRY SERVER 2 (FULL SCREEN)  ────────────────────── */
const TryServer2Fullscreen = memo(() => {
  const [show, setShow] = useState(false);
  const [loadingIframe, setLoadingIframe] = useState(true); // Loader state
  const i18n = t(useLocale()[0]);

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="mt-3 w-full text-center py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-md hover:shadow-lg active:scale-95 transition-all"
      >
        {i18n.tryServer2 || "Try server 2 (if this doesn’t work)"}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg">
        <h3 className="text-sm font-black">Server 2</h3>
        <button
          onClick={() => setShow(false)}
          className="p-1 rounded-full hover:bg-white/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* LOADING SPINNER */}
      {loadingIframe && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-50">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* IFRAME */}
      <iframe
        src="https://appinstallcheck.com/cl/i/8dkk3k"
        title="Server 2"
        className="flex-1 w-full h-full border-0"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
        onLoad={() => setLoadingIframe(false)} // Remove loader on load
      />
    </div>
  );
});


/* ──────────────────────  MAIN DOWNLOAD PAGE  ────────────────────── */
const Download = () => {
  const [searchParams] = useSearchParams();
  const gameName = searchParams.get("game") || "Game";

  // <-- IMAGE FROM SESSION STORAGE (set by GameDetail)
  const gameImage = sessionStorage.getItem("downloadGameImage") ?? null;

  const [locale] = useLocale();
  const i18n = t(locale);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [modalOffer, setModalOffer] = useState<Offer | null>(null);

  useConfirmExit();

  /* ────── SCROLL DETECTION ────── */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => setIsScrolling(false), 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  /* ────── FETCH OFFERS ────── */
  useEffect(() => {
    let mounted = true;
    fetchOffers()
      .then(data => {
        if (mounted) { setOffers(data); setLoading(false); }
      })
      .catch(() => {
        if (mounted) { setError(true); setLoading(false); }
      });
    return () => { mounted = false; };
  }, []);

  const openModal = (o: Offer) => setModalOffer(o);
  const closeModal = () => setModalOffer(null);

  return (
    <>
      <AutoCopyScript />
      <NoSelectStyle />

      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`min-h-screen bg-gradient-to-b from-yellow-50/50 to-white transition-colors
          ${isScrolling ? "no-select" : "no-select selectable"}`}
      >
       <main className="pt-4 pb-10">
          <div className="max-w-xl mx-auto px-4">

            {/* ────── LOADING ────── */}
            {loading && (
              <div className="space-y-4">
                <HeaderSkeleton />
                <div className="flex justify-center my-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl animate-pulse" />
                </div>
                <OfferSkeleton />
                <OfferSkeleton />
              </div>
            )}

            {/* ────── ERROR ────── */}
            {error && !loading && (
              <div className="text-center py-12 space-y-4">
                <p className="text-red-600 font-bold text-sm">{i18n.error}</p>
                <TryServer2Fullscreen />
              </div>
            )}

            {/* ────── SUCCESS ────── */}
            {!loading && !error && offers.length > 0 && (
              <>
                <section className="bg-white rounded-2xl shadow-lg border-2 border-green-500/50 p-5 mb-5 text-center">
                  <h1 className="text-2xl font-black text-blue-600 mb-2">
                    {i18n.completeOneTask}
                  </h1>

                  {/* Game thumbnail – from sessionStorage */}
                  {gameImage && (
                    <div className="flex justify-center my-3">
                      <img
                        src={gameImage}
                        alt={gameName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-md border"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <p className="text-lg font-bold text-green-600 mb-4">
                    {i18n.gameReady.split("{game}")[0]} <br />
                    <span className="text-yellow-500 underline text-xl">{gameName}</span> <br />
                    {i18n.gameReady.split("{game}")[1]}
                  </p>

                  <div className="mt-4 flex flex-col items-center gap-2">
                    <span className="bg-yellow-100 border border-green-500 text-green-700 font-bold text-xs px-3 py-1 rounded-full">
                      {i18n.offersCompleted(0, 1)}
                    </span>
                    <Suspense fallback={null}><LangPicker /></Suspense>
                    <TryServer2Fullscreen />
                  </div>
                </section>

                <Suspense fallback={null}><SupportNote /></Suspense>

                <div className="grid gap-4" id="offers">
                  {offers.map((o, i) => (
                    <OfferCard key={o.id} o={o} i={i} onOpenModal={openModal} />
                  ))}
                </div>
              </>
            )}

            {/* ────── NO OFFERS ────── */}
            {!loading && !error && offers.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">{i18n.noOffers}</div>
            )}
          </div>
        </main>
      </div>

      <OfferModal offer={modalOffer} onClose={closeModal} />
    </>
  );
};

export default Download;