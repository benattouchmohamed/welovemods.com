import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Clock,
  DollarSign,
  Smartphone,
  Monitor,
  Gamepad2,
  Gift,
  Star,
  Globe,
  ChevronDown,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import Navbar from "@/components/Navbar";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";

/* ────────────────────────────────────────────────────────────────────────
   Language Picker – Correct Flag + Name Based on Current Locale
   ──────────────────────────────────────────────────────────────────────── */
const LangPicker = () => {
  const [locale, setLocale] = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", flag: "US", name: "English" },
    { code: "es", flag: "ES", name: "Español" },
    { code: "ko", flag: "KR", name: "한국어" },
    { code: "ja", flag: "JP", name: "日本語" },
    { code: "ar", flag: "SA", name: "العربية" },
    { code: "fr", flag: "FR", name: "Français" },
    { code: "ru", flag: "RU", name: "Русский" },
  ] as const;

  const current = languages.find((l) => l.code === locale) ?? languages[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative flex justify-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
        aria-label={`Current language: ${current.name}`}
      >
        <Globe className="w-4 h-4 text-cartoon-blue dark:text-cartoon-blue" />
        <ReactCountryFlag
          countryCode={current.flag}
          svg
          style={{ width: "1.3em", height: "1.3em" }}
          className="rounded-sm"
        />
        <span className="text-sm font-medium hidden sm:inline text-gray-900 dark:text-white">
          {current.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute bottom-full mb-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-cartoon-blue/30 dark:scrollbar-thumb-cartoon-blue/50 scrollbar-track-cartoon-cream/50 dark:scrollbar-track-gray-700">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code as any);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                locale === lang.code
                  ? "bg-cartoon-blue/10 text-cartoon-blue"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ReactCountryFlag
                countryCode={lang.flag}
                svg
                style={{ width: "1.5em", height: "1.5em" }}
                className="rounded-sm"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {lang.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────────
   Main Download Page
   ──────────────────────────────────────────────────────────────────────── */
const Download = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameName = searchParams.get("game") || "Game";
  const [locale] = useLocale();
  const i18n = t(locale);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const fetched = await fetchOffers();
        setOffers(fetched);
      } catch (e) {
        console.error(e);
        setError(i18n.error || "Failed to load offers. Try the link below.");
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, [locale, i18n.error]);

  const getIcon = (name: string) => {
    const size = "w-5 h-5 sm:w-6 sm:h-6";
    const icons: Record<string, JSX.Element> = {
      Smartphone: <Smartphone className={`${size} text-cartoon-cream`} />,
      Monitor: <Monitor className={`${size} text-cartoon-cream`} />,
      Gamepad2: <Gamepad2 className={`${size} text-cartoon-cream`} />,
      Gift: <Gift className={`${size} text-cartoon-cream`} />,
    };
    return icons[name] || <DollarSign className={`${size} text-cartoon-cream`} />;
  };

  /* ──────── Stars – NO NUMBERS, just 5 stars (recommended = orange) ──────── */
  const renderStars = (isRecommended: boolean) => {
    const color = isRecommended ? "text-cartoon-orange" : "text-yellow-500 dark:text-yellow-400";
    return (
      <div className={`flex items-center gap-0.5 ${color}`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"
          />
        ))}
      </div>
    );
  };

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-b from-cartoon-cream/30 to-white dark:from-gray-900 dark:to-gray-800 transition-colors"
    >
      <Navbar />
      <main className="pt-16 pb-10 sm:pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* LOADING */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-cartoon-orange border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="text-center py-12">
              <p className="text-cartoon-red dark:text-red-400 font-bold mb-4">{error}</p>
              <a
                href="https://appinstallcheck.com/cl/i/8dkk3k"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-cartoon-blue to-cartoon-purple text-cartoon-cream font-black py-2.5 px-6 rounded-full text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                {i18n.tryOffers || "Try Offers Here"}
              </a>
            </div>
          )}

          {/* SUCCESS */}
          {!loading && !error && (
            <>
              <br />

              {/* HERO */}
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-cartoon-blue dark:border-cartoon-blue/50 p-5 sm:p-7 mb-6 text-center overflow-hidden">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cartoon-pink/5 to-cartoon-purple/5 dark:from-cartoon-pink/10 dark:to-cartoon-purple/10 rounded-2xl" />
                  <div className="relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-black text-cartoon-blue dark:text-cartoon-blue mb-2">
                      {i18n.unlock} <br />
                      <span className="text-cartoon-purple dark:text-cartoon-purple drop-shadow-sm">
                        {gameName}
                      </span>
                    </h1>
                    <p className="text-sm sm:text-base font-bold text-cartoon-blue dark:text-cartoon-blue mb-1">
                      {i18n.completeOffer(2)}{" "}
                      <span className="text-cartoon-green dark:text-cartoon-green">
                        {i18n.toGetTheGame}
                      </span>
                    </p>
                    <p className="text-sm sm:text-base font-bold text-cartoon-blue dark:text-cartoon-blue">
                      {i18n.downloadStarts}
                    </p>
                    <div className="mt-5 flex flex-col items-center gap-3">
                      <span className="bg-cartoon-cream dark:bg-gray-700 border-2 border-cartoon-blue dark:border-cartoon-blue text-cartoon-blue dark:text-cartoon-blue font-bold text-xs sm:text-sm px-3 py-1 rounded-full shadow">
                        {i18n.offersCompleted(0, 2)}
                      </span>
                      <button
                        onClick={() => setShowGuide(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-cartoon-pink to-cartoon-purple text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition"
                      >
                        {i18n.howToGuide}
                      </button>
                      <LangPicker />
                    </div>
                  </div>
                </div>
              </section>

              {/* APP DOWNLOAD TIP */}
              <div className="relative mb-8 overflow-hidden rounded-2xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-cartoon-orange via-cartoon-pink to-cartoon-purple opacity-90" />
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                <div className="relative p-4 sm:p-5 flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cartoon-cream dark:bg-gray-700 shadow-lg flex items-center justify-center animate-pulse">
                      <Star className="w-6 h-6 sm:w-7 sm:h-7 text-cartoon-orange fill-current" />
                    </div>
                    <div className="absolute -inset-1 bg-cartoon-orange/30 rounded-full blur-md animate-pulse" />
                  </div>
                  <p className="text-white font-black text-sm sm:text-base leading-tight">
                    {i18n.appDownloadTip}
                  </p>
                </div>
              </div>

              {/* GUIDE MODAL */}
              {showGuide && (
                <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center z-50 p-4">
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-xs sm:max-w-sm w-full overflow-hidden shadow-2xl">
                    <button
                      onClick={() => setShowGuide(false)}
                      className="absolute top-2 right-2 w-8 h-8 bg-cartoon-red text-white rounded-full flex items-center justify-center font-bold text-sm hover:bg-red-600 transition"
                    >
                      X
                    </button>
                    <img src="/images/guide.png" alt="Guide" className="w-full" />
                  </div>
                </div>
              )}

              {/* OFFERS GRID */}
              <div className="grid gap-4 sm:gap-5">
                {offers.map((o, i) => {
                  const isRecommended = i < 2; // Only first 2

                  return (
                    <article
                      key={o.id}
                      className={`bg-cartoon-cream dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border-2 shadow hover:shadow-lg transition-all hover:-translate-y-0.5 ${
                        i % 2 === 0 ? "border-cartoon-purple" : "border-cartoon-pink"
                      } ${isRecommended ? "ring-2 ring-cartoon-orange/50" : ""}`}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-cartoon-pink dark:bg-cartoon-pink/20 p-2 flex items-center justify-center flex-shrink-0 shadow-md">
                          {o.image ? (
                            <img
                              src={o.image}
                              alt={o.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            getIcon(o.icon)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-black text-base sm:text-lg text-cartoon-blue dark:text-cartoon-blue line-clamp-2 flex-1 pr-2">
                              {o.title}
                            </h3>
                            {isRecommended && (
                              <span className="bg-cartoon-orange text-cartoon-cream text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                {i18n.recommended}
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                            {o.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3 text-xs sm:text-sm">
                              <div className="flex items-center gap-1 text-cartoon-blue dark:text-cartoon-blue">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="font-bold">{o.timeEstimate}</span>
                              </div>
                              <span className="font-bold text-cartoon-green dark:text-cartoon-green">
                                {o.difficulty}
                              </span>
                            </div>
                            {renderStars(isRecommended)}
                          </div>
                          <a
                            href={o.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 block w-full text-cartoon-cream font-black text-center py-2.5 rounded-xl text-sm shadow bg-gradient-to-r from-cartoon-blue to-cartoon-purple hover:shadow-md transition-all hover:-translate-y-0.5"
                          >
                            {i18n.completeOfferBtn}
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* TRAFFIC BOOSTER */}
              <div className="mt-6 bg-gradient-to-r from-cartoon-purple to-cartoon-blue rounded-2xl p-5 text-center shadow-xl border-2 border-cartoon-cream dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <p className="text-cartoon-cream dark:text-cartoon-cream font-black text-sm sm:text-base">
                    {i18n.onceComplete || "Once you complete 2 offers"} →{" "}
                    <span className="text-cartoon-green dark:text-cartoon-green">
                      {i18n.autoRedirect}
                    </span>
                  </p>
                </div>
                <div className="bg-cartoon-cream dark:bg-gray-700 text-cartoon-purple dark:text-cartoon-purple font-black text-xs sm:text-sm py-1.5 px-4 rounded-full inline-block shadow-md">
                  {i18n.topSite}
                </div>
                <p className="text-cartoon-cream/90 dark:text-cartoon-cream/80 text-xs sm:text-sm mt-3 font-bold">
                  {i18n.mostUsers("< 3 min")}
                </p>
              </div>
              <br />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Download;