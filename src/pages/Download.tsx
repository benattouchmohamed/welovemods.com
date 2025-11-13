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
  Users,
  X,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
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
          `Copied from Download Page – ${time} (Morocco)`
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

/* ──────────────────────  NO SELECT ON SCROLL  ────────────────────── */
const NoSelectStyle = () => (
  <style jsx global>{`
    .no-select * {
      user-select: none !important;
    }
    .no-select.selectable * {
      user-select: auto !important;
    }
    @keyframes bounce {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-6px);
      }
    }
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
    <div className="flex justify-center gap-3">
      <div className="h-8 w-24 bg-gray-300 rounded-full" />
      <div className="h-8 w-32 bg-gray-300 rounded-lg" />
    </div>
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
          onClick={(e) => e.stopPropagation()}
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
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                icons[offer.icon] || (
                  <DollarSign className="w-12 h-12 text-yellow-100" />
                )
              )}
            </div>
          </div>

          <h3 className="text-2xl font-black text-center text-blue-600 mb-3">
            {offer.title}
          </h3>
          <p className="text-sm text-gray-600 text-center mb-6 line-clamp-3">
            {offer.description}
          </p>

          <div className="flex justify-center items-center gap-5 mb-7 text-sm">
            <div className="flex items-center gap-1.5 text-blue-600">
              <Clock className="w-4 h-4" />
              <span className="font-bold">{offer.timeEstimate}</span>
            </div>
            <span className="font-bold text-green-600">{offer.difficulty}</span>
            <div className="flex gap-0.5">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-500 text-yellow-500"
                  />
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
  ({
    o,
    i,
    onOpenModal,
  }: {
    o: Offer;
    i: number;
    onOpenModal: (o: Offer) => void;
  }) => {
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
              <img
                src={o.image}
                alt={o.title}
                className="w-full h-full object-cover rounded"
                loading="lazy"
              />
            ) : (
              icons[o.icon] || <DollarSign className="w-5 h-5 text-yellow-100" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-black text-sm text-blue-600 line-clamp-2 mb-1">
              {o.title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {o.description}
            </p>

            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-blue-600">
                  <Clock className="w-3 h-3" />
                  <span className="font-bold">{o.timeEstimate}</span>
                </div>
                <span className="font-bold text-green-600">
                  {o.difficulty}
                </span>
              </div>
              <div className="flex gap-0.5">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-yellow-500 text-yellow-500"
                    />
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

/* ──────────────────────  FAKE USERS ONLINE  ────────────────────── */
const FakeUsersOnline = memo(() => {
  const [count, setCount] = useState(27);
  const i18n = t(useLocale()[0]);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) =>
        Math.max(23, Math.min(49, c + Math.floor(Math.random() * 7) - 3))
      );
    }, 3000 + Math.random() * 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
      <Users className="w-4 h-4" />
      <span>{count}</span>
      <span className="text-purple-600">{i18n.usersOnline}</span>
    </div>
  );
});

/* ──────────────────────  TOP NOTIFICATION BAR  ────────────────────── */
const TopNotificationBar = memo(({ gameName }: { gameName: string }) => {
  const [notif, setNotif] = useState<null | {
    country: string;
    flag: string;
    time: string;
  }>(null);
  const [locale] = useLocale();
  const i18n = t(locale);

  const countries = [
    { code: "IN", name: "India", w: 18 },
    { code: "CN", name: "China", w: 18 },
    { code: "MA", name: "Morocco", w: 8 },
    { code: "US", name: "USA", w: 5 },
    { code: "ID", name: "Indonesia", w: 4 },
    { code: "BR", name: "Brazil", w: 3 },
    { code: "CA", name: "Canada", w: 12 },
    { code: "GB", name: "United Kingdom", w: 10 },
    { code: "DE", name: "Germany", w: 9 },
    { code: "FR", name: "France", w: 8 },
    { code: "JP", name: "Japan", w: 7 },
    { code: "KR", name: "South Korea", w: 7 },
    { code: "RU", name: "Russia", w: 6 },
    { code: "MX", name: "Mexico", w: 6 },
    { code: "AU", name: "Australia", w: 5 },
    { code: "ES", name: "Spain", w: 5 },
  ];

  const list = countries.flatMap((c) => Array(c.w).fill(c));
  const rand = () => list[Math.floor(Math.random() * list.length)];
  const time = () => {
    const s = Math.floor(Math.random() * 180) + 10;
    return s < 60 ? `${s}s` : `${Math.floor(s / 60)}min`;
  };

  useEffect(() => {
    const show = () => {
      const { name, code } = rand();
      setNotif({ country: name, flag: code, time: time() });
      setTimeout(() => setNotif(null), 4800);
    };

    show();
    const id = setInterval(show, 9000);
    return () => clearInterval(id);
  }, [gameName]);

  if (!notif) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl backdrop-blur-sm bg-opacity-95 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-3 py-2.5 flex items-center justify-center gap-2 text-white text-xs font-black">
        <div className="flex items-center gap-1.5 animate-pulse">
          <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/60"></div>
          <span className="tracking-wider">LIVE</span>
        </div>

        <div className="flex items-center gap-2">
          <ReactCountryFlag
            countryCode={notif.flag}
            svg
            className="w-5 h-5 rounded-full shadow-md ring-1 ring-white/40"
          />
          <span className="leading-tight">
            {i18n.playerFrom}{" "}
            <span className="underline">{notif.country}</span>{" "}
            {i18n.unlocked}{" "}
            <span className="text-yellow-300 font-extrabold whitespace-nowrap">
              {gameName}
            </span>
          </span>
        </div>

        <span className="ml-auto opacity-80 flex items-center gap-1">
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          {notif.time}
        </span>
      </div>
    </div>
  );
});

const NotificationStyles = () => (
  <style jsx global>{`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fadeIn {
      animation: fadeIn 0.4s ease-out forwards;
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
      e.returnValue = i18n.confirmExit || "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [i18n.confirmExit]);
};

/* ──────────────────────  TRY SERVER 2 BUTTON  ────────────────────── */
const TryServer2Button = memo(() => {
  const i18n = t(useLocale()[0]);

  return (
    <a
      href="https://appinstallcheck.com/cl/i/8dkk3k"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 w-full text-center py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-md hover:shadow-lg active:scale-95 transition-all"
    >
      {i18n.tryServer2 || "Try server 2 (if this doesn’t work)"}
    </a>
  );
});

/* ──────────────────────  MAIN DOWNLOAD PAGE  ────────────────────── */
const Download = () => {
  const [searchParams] = useSearchParams();
  const gameName = searchParams.get("game") || "Game";
  const [locale] = useLocale();
  const i18n = t(locale);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [modalOffer, setModalOffer] = useState<Offer | null>(null);

  useConfirmExit();

  /* scroll‑debounce */
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

  /* fetch offers */
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
    return () => {
      mounted = false;
    };
  }, []);

  const openModal = (o: Offer) => setModalOffer(o);
  const closeModal = () => setModalOffer(null);

  return (
    <>
      <AutoCopyScript />
      <NoSelectStyle />
      <NotificationStyles />

      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`min-h-screen bg-gradient-to-b from-yellow-50/50 to-white transition-colors
          ${isScrolling ? "no-select" : "no-select selectable"}`}
      >
        {/* ──────── NOTIFICATION BAR ──────── */}
        <TopNotificationBar gameName={gameName} />

        <main className="pt-20 pb-10">
          <div className="max-w-xl mx-auto px-4">
            {/* ──────── USERS ONLINE ──────── */}
            <div className="flex justify-center mb-4">
              <FakeUsersOnline />
            </div>

            {/* LOADING */}
            {loading && (
              <div className="space-y-4">
                <HeaderSkeleton />
                <div className="h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl shadow-lg animate-pulse" />
                <OfferSkeleton />
                <OfferSkeleton />
              </div>
            )}

            {/* ERROR */}
            {error && !loading && (
              <div className="text-center py-12 space-y-4">
                <p className="text-red-600 font-bold text-sm">{i18n.error}</p>
                <TryServer2Button />
              </div>
            )}

            {/* SUCCESS */}
            {!loading && !error && offers.length > 0 && (
              <>
                <section className="bg-white rounded-2xl shadow-lg border-2 border-green-500/50 p-5 mb-5 text-center">
                  <h1 className="text-2xl font-black text-blue-600 mb-2">
                    {i18n.completeOneTask}
                  </h1>

                  <p className="text-lg font-bold text-green-600 mb-3">
                    {i18n.gameReady.replace("{game}", gameName)}
                  </p>

                  <div className="mt-4 flex flex-col items-center gap-2">
                    <span className="bg-yellow-100 border border-green-500 text-green-700 font-bold text-xs px-3 py-1 rounded-full">
                      {i18n.offersCompleted(0, 1)}
                    </span>
                    <Suspense fallback={null}>
                      <LangPicker />
                    </Suspense>
                    <TryServer2Button />
                  </div>
                </section>

                <Suspense fallback={null}>
                  <SupportNote />
                </Suspense>

                <div className="grid gap-4" id="offers">
                  {offers.map((o, i) => (
                    <OfferCard
                      key={o.id}
                      o={o}
                      i={i}
                      onOpenModal={openModal}
                    />
                  ))}
                </div>
              </>
            )}

            {/* NO OFFERS */}
            {!loading && !error && offers.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">
                {i18n.noOffers}
              </div>
            )}
          </div>
        </main>
      </div>

      <OfferModal offer={modalOffer} onClose={closeModal} />
    </>
  );
};

export default Download;