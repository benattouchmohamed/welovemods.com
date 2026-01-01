'use client';

import React, { useEffect, useState, memo, lazy, Suspense } from "react";
import { Gift, MousePointerClick } from "lucide-react";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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

/* ────────────────────── PRO STYLES + CUSTOM DOTS ────────────────────── */
const NoSelectStyle = () => (
  <style>{`
    .no-select * { user-select: none !important; }
    .no-select.selectable * { user-select: auto !important; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    .animate-shimmer {
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }

    /* PRO SLIDE ANIMATION */
    .swiper-slide {
      opacity: 0;
      transform: translateX(60px);
      transition: all 0.9s cubic-bezier(0.22, 0.61, 0.36, 1);
    }
    .swiper-slide-active {
      opacity: 1;
      transform: translateX(0);
    }

    /* CUSTOM DOTS STYLE */
    .swiper-pagination {
      bottom: 0 !important;
    }
    .swiper-pagination-bullet {
      width: 10px;
      height: 10px;
      background: rgba(100, 116, 139, 0.4);
      opacity: 0.7;
      margin: 0 6px !important;
      transition: all 0.3s ease;
    }
    .swiper-pagination-bullet-active {
      background: #10b981;
      opacity: 1;
      transform: scale(1.4);
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.7);
    }

    /* Ellipsis for >3 offers */
    .swiper-pagination.custom-ellipsis .swiper-pagination-bullet:nth-child(n+4) {
      display: none;
    }
    .swiper-pagination.custom-ellipsis::after {
      content: "...";
      color: #64748b;
      font-weight: bold;
      font-size: 18px;
      margin-left: 8px;
      position: relative;
      top: -2px;
    }

    :root {
      --custom-background-color: rgba(255, 255, 255, 0.77);
    }
    .custom-ocean-bg {
      background-color: var(--custom-background-color) !important;
    }
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

/* ────────────────────── OFFER BUTTON ────────────────────── */
const OfferClickButton = memo(({ url, initialText, retryText }: { url: string; initialText: string; retryText: string }) => {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
    setClicked(true);
  };
  return (
    <button
      onClick={handleClick}
      className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
    >
      {clicked ? retryText : initialText}
    </button>
  );
});

/* ────────────────────── OFFER CARD ────────────────────── */
const OfferCard = memo(({ offer }: { offer: Offer }) => {
  const [locale] = useLocale();
  const i18n = t(locale);

  return (
    <article className="relative bg-white rounded-xl p-3.5 border-4 border-yellow-400 shadow-2xl animate-fadeIn">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-50 opacity-70 rounded-xl" />
      <div className="relative flex gap-3">
        <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-1.5 ring-4 ring-yellow-300 ring-opacity-50 shadow-lg flex-shrink-0 flex items-center justify-center w-14 h-14">
          {offer.image ? (
            <img src={offer.image} alt={offer.title} className="w-full h-full object-cover rounded-md" loading="lazy" />
          ) : (
            <Gift className="text-white w-8 h-8" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-base text-blue-600 line-clamp-2 leading-tight">{offer.title}</h3>
          <p className="text-base text-gray-700 mt-2 leading-relaxed">{offer.description}</p>
          <OfferClickButton
            url={offer.url}
            initialText={i18n.completeOfferBtn ?? "Complete Task"}
            retryText={i18n.notCompletedClickAgain ?? "Not done? Try again"}
          />
        </div>
      </div>
    </article>
  );
});

/* ────────────────────── SERVER 2 FULLSCREEN ────────────────────── */
const Server2Fullscreen = memo(({ autoOpen = false }: { autoOpen?: boolean }) => {
  const [open, setOpen] = useState(autoOpen);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-xs font-bold bg-blue-100 text-green-700 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-200 hover:text-green-800 active:scale-95 transition-all duration-200"
      >
        <MousePointerClick size={14} />
        Server 2
      </button>
    );
  }

  return (
<div className="fixed inset-0 z-50 bg-white flex flex-col animate-fadeIn">
      {/* Premium Blue Gradient Header */}
      <div className="relative flex items-center justify-center p-5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-2xl">
        <h3 className="text-xl font-black tracking-tight">Server 2</h3>

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 transition-all duration-200 backdrop-blur-sm"
          aria-label="Close Server 2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Open in New Tab Button */}
        <button
          onClick={() => window.open("https://appinstallcheck.com/cl/i/8dkk3k", "_blank", "noopener,noreferrer")}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 transition-all duration-200 backdrop-blur-sm"
          title="Open in new tab"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>

      {/* Loading Overlay */}
      {!iframeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-5 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-blue-600 font-semibold text-lg">Loading Server 2...</p>
          </div>
        </div>
      )}
      <iframe
        src="https://appinstallcheck.com/cl/i/8dkk3k"
        title="Server 2"
        className="flex-1 w-full"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation"
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

  const [sortedOffers, setSortedOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

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
          const sorted = [...data].sort((a, b) => {
            const diffA = Math.abs(a.epc - a.payout);
            const diffB = Math.abs(b.epc - b.payout);
            if (diffA !== diffB) return diffA - diffB;
            return b.payout - a.payout;
          });
          setSortedOffers(sorted);
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

  const offerCount = sortedOffers.length;
  const showEllipsis = offerCount > 3;

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
                <OfferSkeleton />
              </div>
            )}

            {error && (
              <div className="text-center py-20">
                <p className="text-red-600 font-bold text-2xl mb-8">Something went wrong</p>
                <Server2Fullscreen autoOpen={false} />
              </div>
            )}

            {!loading && !error && (
              <>
                <section className="bg-white rounded-3xl shadow-xl p-6 mb-6 text-center border-2 border-[#D4AF37] hover:border-[#F6E27F] transition-all">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Server 1</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
                    {i18n.completeOneTask ?? "Do 1 quick task"}
                  </h1>
                  <p className="text-lg font-bold text-green-600">
                    {gameName} <span className="text-blue-600">is ready!</span>
                  </p>
                  <div className="mt-6 flex flex-col items-center gap-5">
                    <Suspense fallback={null}>
                      {/* <LangPicker /> */}
                    </Suspense>
                    <Server2Fullscreen autoOpen={offerCount === 0} />
                  </div>
                </section>

                {/* PRO CAROUSEL – AUTO + DOTS + ELLIPSIS WHEN >3 */}
                {offerCount > 0 && (
                  <div className="relative">
                    <Swiper
                      modules={[Autoplay, Pagination]}
                      spaceBetween={30}
                      slidesPerView={1}
                      loop={true}
                      autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      speed={900}
                      pagination={{
                        clickable: true,
                        bulletClass: `swiper-pagination-bullet ${showEllipsis ? 'custom-ellipsis' : ''}`,
                      }}
                      className="pb-14" // Extra space for nice dots
                    >
                      {sortedOffers.map((offer) => (
                        <SwiperSlide key={offer.id ?? offer.url}>
                          <OfferCard offer={offer} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Download;