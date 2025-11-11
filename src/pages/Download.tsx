/* Download.tsx – MULTI-COUNTRY NOTIFICATIONS + MOROCCO PRIORITY */
import React, { useEffect, useState, useRef, memo, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Clock, DollarSign, Smartphone, Monitor, Gamepad2, Gift, Star, Users, Flag,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";

/* ──────────────────────  AUTO-COPY SCRIPT (Ctrl+C)  ────────────────────── */
const AutoCopyScript = () => {
  const { locale } = useLocale();
  const time = new Date().toLocaleString("en-GB", { timeZone: "Africa/Casablanca" });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "c") {
        const text = `Copied from Download Page – ${time} (Morocco)`;
        navigator.clipboard.writeText(text).then(() => {
          const toast = document.createElement("div");
          toast.textContent = "Copied!";
          toast.style.cssText = `
            position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
            background:#10b981;color:white;padding:0.5rem 1rem;border-radius:9999px;
            font-size:0.75rem;font-weight:bold;z-index:50;box-shadow:0 4px 6px rgba(0,0,0,0.1);
            animation:bounce 0.6s
          `.replace(/\s+/g, " ");
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 2000);
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [time]);

  return null;
};

/* ──────────────────────  NO SELECT WHILE SCROLLING  ────────────────────── */
const NoSelectStyle = () => (
  <style jsx global>{`
    .no-select-while-scrolling * { user-select: none !important; }
    .no-select-while-scrolling.selectable * { user-select: auto !important; }
    @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  `}</style>
);

/* Lazy-load */
const LangPicker = lazy(() => import("./LangPicker"));
const SupportNote = lazy(() => import("./SupportNote"));

/* ──────────────────────  SKELETON COMPONENTS  ────────────────────── */
const HeaderSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 animate-pulse">
    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4" />
    <div className="flex justify-center gap-3">
      <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-full" />
      <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded-lg" />
    </div>
  </div>
);

const OfferSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-3.5 border-2 border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex gap-3">
      <div className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-gray-700 flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-1" />
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-5/6 mb-3" />
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  </div>
);

const TipBannerSkeleton = () => (
  <div className="relative mb-6 overflow-hidden rounded-xl shadow-lg h-12 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 opacity-90" />
  </div>
);

/* ──────────────────────  OFFER CARD  ────────────────────── */
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
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-3.5 border-2 shadow hover:shadow-md transition-all
        ${i % 2 === 0 ? "border-cartoon-purple" : "border-cartoon-pink"}
        ${isRecommended ? "ring-2 ring-cartoon-orange/40" : ""}
      `}
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

/* ──────────────────────  FAKE USERS ONLINE  ────────────────────── */
const FakeUsersOnline = () => {
  const [count, setCount] = useState(23);
  const i18n = t(useLocale()[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => Math.max(23, Math.min(49, prev + Math.floor(Math.random() * 7) - 3)));
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-cartoon-blue dark:text-cartoon-blue">
      <Users className="w-4 h-4" />
      <span>{count}</span>
      <span className="text-cartoon-purple">{i18n.usersOnline}</span>
    </div>
  );
};

/* ──────────────────────  TOP NOTIFICATION BAR  ────────────────────── */
/* ──────────────────────  TOP NOTIFICATION BAR – 21 COUNTRIES + MOROCCO BOOST  ────────────────────── */
interface Notification {
  id: number;
  country: string;
  flag: string;
  timeAgo: string;
}

const TopNotificationBar = ({ gameName }: { gameName: string }) => {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const idRef = useRef(0);
  const [locale] = useLocale();
  const i18n = t(locale);

  const countries = [
    // Top 20 by 2025 population + Morocco (boosted)
    { code: "IN", name: "India", weight: 18 },
    { code: "CN", name: "China", weight: 18 },
    { code: "US", name: "USA", weight: 4 },
    { code: "ID", name: "Indonesia", weight: 3 },
    { code: "PK", name: "Pakistan", weight: 3 },
    { code: "NG", name: "Nigeria", weight: 3 },
    { code: "BR", name: "Brazil", weight: 2 },
    { code: "BD", name: "Bangladesh", weight: 2 },
    { code: "RU", name: "Russia", weight: 2 },
    { code: "ET", name: "Ethiopia", weight: 2 },
    { code: "MX", name: "Mexico", weight: 2 },
    { code: "JP", name: "Japan", weight: 1 },
    { code: "PH", name: "Philippines", weight: 1 },
    { code: "EG", name: "Egypt", weight: 1 },
    { code: "VN", name: "Vietnam", weight: 1 },
    { code: "DR", name: "DR Congo", weight: 1 },
    { code: "TR", name: "Turkey", weight: 1 },
    { code: "IR", name: "Iran", weight: 1 },
    { code: "DE", name: "Germany", weight: 1 },
    { code: "TH", name: "Thailand", weight: 1 },
    // Morocco Priority Boost
    { code: "MA", name: "Morocco", weight: 6 },
  ];

  const weightedList = countries.flatMap(c => Array(c.weight).fill(c));

  const randomCountry = () => weightedList[Math.floor(Math.random() * weightedList.length)];
  const randomTime = () => {
    const secs = Math.floor(Math.random() * 180) + 10;
    return secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}min`;
  };

  useEffect(() => {
    const showNext = () => {
      const { name, code } = randomCountry();
      const notif: Notification = {
        id: ++idRef.current,
        country: name,
        flag: code,
        timeAgo: randomTime(),
      };
      setNotifs([notif]);
    };

    showNext();
    const interval = setInterval(showNext, 6000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [gameName]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-cartoon-blue to-cartoon-purple shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-center gap-2 overflow-hidden">
        {notifs.map(n => (
          <div
            key={n.id}
            className="flex items-center gap-2 text-white animate-slideIn opacity-0 text-xs font-black"
            style={{ animation: "slideIn 0.6s ease-out forwards, fadeOut 0.6s ease-out 5.4s forwards" }}
          >
            <ReactCountryFlag countryCode={n.flag} svg style={{ width: 22, height: 22, borderRadius: "50%" }} />
            <span>
              {i18n.playerFrom} <span className="underline">{n.country}</span> {i18n.unlocked}{" "}
              <span className="text-cartoon-cream">{gameName}</span>{" "}
              <span className="text-cartoon-green">download successfully</span>
            </span>
            <span className="text-[10px] ml-auto opacity-80">{n.timeAgo} ago</span>
          </div>
        ))}
      </div>
    </div>
  );
};
const TopNotificationStyles = () => (
  <style jsx global>{`
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeOut {
      to { opacity: 0; transform: translateY(-10px); }
    }
  `}</style>
);

/* ──────────────────────  CONFIRM EXIT  ────────────────────── */
const useConfirmExit = () => {
  const [locale] = useLocale();
  const i18n = t(locale);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = i18n.confirmExit || "Are you sure?";
      return i18n.confirmExit;
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [i18n.confirmExit]);
};

/* ──────────────────────  TRY SERVER 2  ────────────────────── */

const TryServer2Button = () => {
  const i18n = t(useLocale()[0]);

  return (
    <a
      href="https://appinstallcheck.com/cl/i/8dkk3k"
      target="_blank"
      rel="noopener noreferrer"
      className="
        mt-3 w-full flex items-center justify-center
        bg-gradient-to-r from-green-500 to-green-600
        text-white font-semibold
        rounded-lg shadow-md
        py-2 px-4
        transition-transform transform
        active:scale-95
        hover:scale-105 hover:shadow-lg
      "
    >
      {i18n.tryServer2 || "Try server 2 (if this doesn't work)"}
    </a>
  );
};


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

  useConfirmExit();

  // Scroll handler
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

  // Fetch offers
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
        if (mounted) {
          setError(i18n.error);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [i18n.error]);

  return (
    <>
      <AutoCopyScript />
      <NoSelectStyle />
      <TopNotificationStyles />

      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`min-h-screen bg-gradient-to-b from-cartoon-cream/30 to-white dark:from-gray-900 dark:to-gray-800 transition-colors
          ${isScrolling ? "no-select-while-scrolling" : "no-select-while-scrolling selectable"}`}
      >
        <TopNotificationBar gameName={gameName} />

        <main className="pt-16 pb-10 sm:pt-20">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <div className="flex justify-center mb-4">
              <FakeUsersOnline />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                <HeaderSkeleton />
                <TipBannerSkeleton />
                <OfferSkeleton />
                <OfferSkeleton />
                <OfferSkeleton />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12 space-y-4">
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

            {/* Success State */}
            {!loading && !error && offers.length > 0 && (
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
                    <TryServer2Button />
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
                      <button onClick={() => setShowGuide(false)} className="absolute top-2 right-2 w-7 h-7 bg-cartoon-red text-white rounded-full flex items-center justify-center text-sm font-bold z-10">X</button>
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

            {/* Empty Offers */}
            {!loading && !error && offers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-sm">{i18n.noOffers || "No offers available."}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Download;