/*  Download.tsx – FAST + NO SELECTION ON SCROLL + AUTO-COPY SCRIPT  */
import React, { useEffect, useState, useRef, memo, lazy, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Clock, DollarSign, Smartphone, Monitor, Gamepad2, Gift, Star, Globe, ChevronDown,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import Navbar from "@/components/Navbar";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";

/* ──────────────────────  AUTO-COPY SCRIPT (Ctrl+C)  ────────────────────── */
const AutoCopyScript = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'c') {
        const text = `Copied from Download Page – ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Casablanca' })} (Morocco)`;
        navigator.clipboard.writeText(text).then(() => {
          const toast = document.createElement('div');
          toast.textContent = 'Copied to clipboard!';
          toast.style.cssText = `
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            bg-green-600 text-white px-4 py-2 rounded-full text-xs font-bold z-50 shadow-lg
            animate-bounce
          `.replace(/\s+/g, ' ');
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 2000);
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  return null;
};

/* ──────────────────────  NO SELECT WHILE SCROLLING  ────────────────────── */
const NoSelectStyle = () => (
  <style jsx global>{`
    .no-select-while-scrolling * { user-select: none !important; }
    .no-select-while-scrolling.selectable * { user-select: auto !important; }
  `}</style>
);

/* Lazy-load components */
const LangPicker = lazy(() => import("./LangPicker"));
const SupportNote = lazy(() => import("./SupportNote"));

/* Skeleton */
const OfferSkeleton = () => (
  <div className="bg-cartoon-cream dark:bg-gray-800 rounded-xl p-3.5 border-2 border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex gap-3">
      <div className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-gray-700" />
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-5/6" />
        <div className="mt-3 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  </div>
);

/* Memoized Offer Card */
const OfferCard = memo(({ o, i, i18n }: { o: Offer; i: number; i18n: any }) => {
  const isRecommended = i < 2;
  const iconMap: Record<string, JSX.Element> = {
    Smartphone: <Smartphone className="w-5 h-5 text-cartoon-cream" />,
    Monitor: <Monitor className="w-5 h-5 text-cartoon-cream" />,
    Gamepad2: <Gamepad2 className="w-5 h-5 text-cartoon-cream" />,
    Gift: <Gift className="w-5 h-5 text-cartoon-cream" />,
  };

  return (
    <article
      key={o.id}
      data-offer-id={o.id}
      className={`bg-cartoon-cream dark:bg-gray-800 rounded-xl p-3.5 border-2 shadow hover:shadow-md transition-all ${
        i % 2 === 0 ? "border-cartoon-purple" : "border-cartoon-pink"
      } ${isRecommended ? "ring-2 ring-cartoon-orange/40" : ""}`}
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-lg bg-cartoon-pink dark:bg-cartoon-pink/20 p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm">
          {o.image ? (
            <img src={o.image} alt={o.title} className="w-full h-full object-cover rounded" loading="lazy" />
          ) : (
            iconMap[o.icon] || <DollarSign className="w-5 h-5 text-cartoon-cream" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-black text-sm text-cartoon-blue dark:text-cartoon-blue line-clamp-2 pr-1">
              {o.title}
            </h3>
            {isRecommended && (
              <span className="bg-cartoon-orange text-cartoon-cream text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {i18n.recommended}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{o.description}</p>
          <div className="flex items-center justify-between mt-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-cartoon-blue">
                <Clock className="w-3 h-3" />
                <span className="font-bold">{o.timeEstimate}</span>
              </div>
              <span className="font-bold text-cartoon-green">{o.difficulty}</span>
            </div>
            <div className={`flex items-center gap-0.5 ${isRecommended ? "text-cartoon-orange" : "text-yellow-500 dark:text-yellow-400"}`}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
          </div>
          <a
            href={o.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 block w-full text-center py-2 rounded-lg text-xs font-black text-cartoon-cream bg-gradient-to-r from-cartoon-blue to-cartoon-purple shadow hover:shadow-md transition"
          >
            {i18n.completeOfferBtn}
          </a>
        </div>
      </div>
    </article>
  );
});

/* ──────────────────────  MAIN PAGE  ────────────────────── */
const Download = () => {
  const [searchParams] = useSearchParams();
  const gameName = searchParams.get("game") || "Game";
  const [locale] = useLocale();
  const i18n = t(locale);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  /* Prevent selection while scrolling */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => setIsScrolling(false), 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  /* Load offers */
  useEffect(() => {
    let mounted = true;
    fetchOffers()
      .then(fetched => {
        if (mounted) {
          setOffers(fetched);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setError(i18n.error || "Failed to load offers.");
      });
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <AutoCopyScript />
      <NoSelectStyle />
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`min-h-screen bg-gradient-to-b from-cartoon-cream/30 to-white dark:from-gray-900 dark:to-gray-800 pb-20 transition-colors
          ${isScrolling ? "no-select-while-scrolling" : "no-select-while-scrolling selectable"}`}
      >
        <Navbar />
        <main className="pt-16 pb-10 sm:pt-20">
          <div className="max-w-xl mx-auto px-4 sm:px-6">

            {loading && (
              <div className="space-y-4">
                <OfferSkeleton />
                <OfferSkeleton />
                <OfferSkeleton />
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-cartoon-red dark:text-red-400 font-bold mb-4 text-sm">{error}</p>
                <a
                  href="https://appinstallcheck.com/cl/i/8dkk3k"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-cartoon-blue to-cartoon-purple text-cartoon-cream font-black py-2 px-5 rounded-full text-xs shadow-lg hover:shadow-xl transition-all"
                >
                  {i18n.tryOffers || "Try Offers Here"}
                </a>
              </div>
            )}

            {!loading && !error && (
              <>
                <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-cartoon-blue dark:border-cartoon-blue/50 p-4 sm:p-6 mb-5 text-center">
                  <h1 className="text-xl sm:text-2xl font-black text-cartoon-blue dark:text-cartoon-blue mb-1">
                    {i18n.unlock} <br />
                    <span className="text-cartoon-purple drop-shadow-sm">{gameName}</span>
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-cartoon-blue dark:text-cartoon-blue mb-1">
                    {i18n.completeOffer(2)}{" "}
                    <span className="text-cartoon-green">{i18n.toGetTheGame}</span>
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-cartoon-blue dark:text-cartoon-blue">
                    {i18n.downloadStarts}
                  </p>
                  <div className="mt-4 flex flex-col items-center gap-2.5">
                    <span className="bg-cartoon-cream dark:bg-gray-700 border border-cartoon-blue text-cartoon-blue font-bold text-xs px-3 py-1 rounded-full">
                      {i18n.offersCompleted(0, 2)}
                    </span>
                    <button
                      onClick={() => setShowGuide(true)}
                      className="bg-gradient-to-r from-cartoon-pink to-cartoon-purple text-white font-bold text-xs px-4 py-2 rounded-lg shadow hover:scale-105 transition"
                    >
                      {i18n.howToGuide}
                    </button>
                    <Suspense fallback={<div className="h-8 w-8" />}>
                      <LangPicker />
                    </Suspense>
                  </div>
                </section>

                <Suspense fallback={null}>
                  <SupportNote />
                </Suspense>

                <div className="relative mb-6 overflow-hidden rounded-xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-cartoon-orange via-cartoon-pink to-cartoon-purple opacity-90" />
                  <div className="relative p-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cartoon-cream dark:bg-gray-700 shadow flex items-center justify-center">
                      <Star className="w-5 h-5 text-cartoon-orange fill-current" />
                    </div>
                    <p className="text-white font-black text-xs leading-tight">{i18n.appDownloadTip}</p>
                  </div>
                </div>

                {showGuide && (
                  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowGuide(false)}>
                    <div className="relative bg-white dark:bg-gray-800 rounded-xl max-w-xs w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setShowGuide(false)}
                        className="absolute top-2 right-2 w-7 h-7 bg-cartoon-red text-white rounded-full flex items-center justify-center text-sm font-bold z-10"
                      >
                        X
                      </button>
                      <img src="/images/guide.png" alt="Guide" className="w-full" loading="lazy" />
                    </div>
                  </div>
                )}

                <div className="grid gap-4" id="offers">
                  {offers.map((o, i) => (
                    <OfferCard key={o.id} o={o} i={i} i18n={i18n} />
                  ))}
                </div>

                <div className="mt-6 bg-gradient-to-r from-cartoon-purple to-cartoon-blue rounded-xl p-4 text-center shadow-lg border border-cartoon-cream dark:border-gray-700 text-xs">
                  <p className="text-cartoon-cream font-black mb-1">
                    {i18n.onceComplete} to <span className="text-cartoon-green">{i18n.autoRedirect}</span>
                  </p>
                  <div className="bg-cartoon-cream dark:bg-gray-700 text-cartoon-purple font-black text-[10px] py-1 px-3 rounded-full inline-block">
                    {i18n.topSite}
                  </div>
                  <p className="text-cartoon-cream/80 text-[10px] mt-2 font-bold">
                    {i18n.mostUsers("< 3 min")}
                  </p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Download;