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
  ArrowDown,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import Navbar from "@/components/Navbar";
import { fetchOffers, type Offer } from "@/services/offerService";
import { useLocale, t } from "@/hooks/useLocale";

/* ────────────────────────────────────────────────────────────────────────
   Language Picker
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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all text-xs"
        aria-label={`Current language: ${current.name}`}
      >
        <Globe className="w-3.5 h-3.5 text-cartoon-blue dark:text-cartoon-blue" />
        <ReactCountryFlag
          countryCode={current.flag}
          svg
          style={{ width: "1.1em", height: "1.1em" }}
          className="rounded-sm"
        />
        <span className="hidden xs:inline text-xs font-medium text-gray-900 dark:text-white">
          {current.name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-cartoon-blue/30 dark:scrollbar-thumb-cartoon-blue/50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code as any);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs transition ${
                locale === lang.code
                  ? "bg-cartoon-blue/10 text-cartoon-blue"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ReactCountryFlag
                countryCode={lang.flag}
                svg
                style={{ width: "1.3em", height: "1.3em" }}
                className="rounded-sm"
              />
              <span className="font-medium text-gray-900 dark:text-white">
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
   Support Note – Compact & Petite (Like a Sticky Note)
   ──────────────────────────────────────────────────────────────────────── */
/* ────────────────────────────────────────────────────────────────────────
   Support Note – Compact & Petite (Like a Sticky Note)
   ──────────────────────────────────────────────────────────────────────── */
const SupportNote = () => {
  const [locale] = useLocale();
  const i18n = t(locale);

  /*  Split the translation into the four visual blocks
      The order in every language is:
      1. “100% FREE • NOT A VIRUS”
      2. “You help me with 0.2$ per offer → You get the game!”
      3. “Just follow the steps.”
      4. “Thanks!”                                   */
  const parts = i18n.supportNote.split('\n');

  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-3 shadow-md mb-5 text-xs sm:text-sm">
      <p className="font-bold text-orange-800 text-center leading-tight space-y-0.5">
        {/* 1. 100% FREE • NOT A VIRUS */}
        <span className="block text-green-600">{parts[0]}</span>

        {/* 2. You help me … → You get the game! */}
        <span className="block text-cartoon-blue dark:text-cartoon-blue">
          {parts[1]}
        </span>

        {/* 3. Just follow the steps. */}
        <span className="block text-gray-700 dark:text-gray-300">
          {parts[2]}
        </span>

        {/* 4. Thanks! */}
        <span className="block text-orange-500">{parts[3]}</span>
      </p>
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
    const size = "w-5 h-5";
    const icons: Record<string, JSX.Element> = {
      Smartphone: <Smartphone className={`${size} text-cartoon-cream`} />,
      Monitor: <Monitor className={`${size} text-cartoon-cream`} />,
      Gamepad2: <Gamepad2 className={`${size} text-cartoon-cream`} />,
      Gift: <Gift className={`${size} text-cartoon-cream`} />,
    };
    return icons[name] || <DollarSign className={`${size} text-cartoon-cream`} />;
  };

  const renderStars = (isRecommended: boolean) => {
    const color = isRecommended ? "text-cartoon-orange" : "text-yellow-500 dark:text-yellow-400";
    return (
      <div className={`flex items-center gap-0.5 ${color}`}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-current" />
        ))}
      </div>
    );
  };

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-b from-cartoon-cream/30 to-white dark:from-gray-900 dark:to-gray-800 transition-colors pb-20"
    >
      <Navbar />
      <main className="pt-16 pb-10 sm:pt-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          {/* LOADING */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-cartoon-orange border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* ERROR */}
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

          {/* SUCCESS */}
          {!loading && !error && (
            <>
              {/* HERO */}<br />
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
                  <LangPicker />
                </div>
              </section>

              {/* SUPPORT NOTE – COMPACT */}
              <SupportNote />

              {/* APP DOWNLOAD TIP */}
              <div className="relative mb-6 overflow-hidden rounded-xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-cartoon-orange via-cartoon-pink to-cartoon-purple opacity-90" />
                <div className="relative p-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cartoon-cream dark:bg-gray-700 shadow flex items-center justify-center">
                    <Star className="w-5 h-5 text-cartoon-orange fill-current" />
                  </div>
                  <p className="text-white font-black text-xs leading-tight">
                    {i18n.appDownloadTip}
                  </p>
                </div>
              </div>

              {/* GUIDE MODAL */}
              {showGuide && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl max-w-xs w-full overflow-hidden shadow-2xl">
                    <button
                      onClick={() => setShowGuide(false)}
                      className="absolute top-2 right-2 w-7 h-7 bg-cartoon-red text-white rounded-full flex items-center justify-center text-sm font-bold z-10"
                    >
                      X
                    </button>
                    <img src="/images/guide.png" alt="Guide" className="w-full" />
                  </div>
                </div>
              )}

              {/* OFFERS GRID */}
              <div className="grid gap-4" id="offers">
                {offers.map((o, i) => {
                  const isRecommended = i < 2;

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
                            <img
                              src={o.image}
                              alt={o.title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            getIcon(o.icon)
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
                          <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                            {o.description}
                          </p>
                          <div className="flex items-center justify-between mt-2 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-cartoon-blue">
                                <Clock className="w-3 h-3" />
                                <span className="font-bold">{o.timeEstimate}</span>
                              </div>
                              <span className="font-bold text-cartoon-green">
                                {o.difficulty}
                              </span>
                            </div>
                            {renderStars(isRecommended)}
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
                })}
              </div>

              {/* TRAFFIC BOOSTER */}
              <div className="mt-6 bg-gradient-to-r from-cartoon-purple to-cartoon-blue rounded-xl p-4 text-center shadow-lg border border-cartoon-cream dark:border-gray-700 text-xs">
                <p className="text-cartoon-cream font-black mb-1">
                  {i18n.onceComplete} →{" "}
                  <span className="text-cartoon-green">{i18n.autoRedirect}</span>
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
  );
};

export default Download;