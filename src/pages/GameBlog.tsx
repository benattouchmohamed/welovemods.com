import React, { useEffect, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Smartphone,
} from "lucide-react";
import { fetchGameBySlug, type Game } from "@/services/gameService";

const BlogSkeleton = () => (
  <div className="min-h-screen bg-[#FFFBEB] px-4 py-8">
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="h-8 w-32 bg-white/70 rounded-full animate-pulse" />
      <div className="h-24 bg-white rounded-[2.5rem] animate-pulse" />
      <div className="h-[400px] bg-white rounded-[2.5rem] animate-pulse" />
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-white rounded-[2rem] animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

const GameBlog = memo(() => {
  const { blogSlug } = useParams<{ blogSlug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Extract game slug from blog slug (e.g. how-to-download-subway-surfers-on-mobile-for-free → subway-surfers)
  const getGameSlugFromBlog = (slug: string): string => {
    return slug
      .replace(/^how-to-download-/, "")
      .replace(/-on-mobile-for-free$/, "")
      .toLowerCase();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadGame = async () => {
      if (!blogSlug) return;
      setLoading(true);
      try {
        const gameSlug = getGameSlugFromBlog(blogSlug);
        const data = await fetchGameBySlug(gameSlug);
        setGame(data);
      } catch (err) {
        console.error("Blog game fetch error:", err);
      } finally {
        setTimeout(() => setLoading(false), 800); // Slight delay for smooth UX
      }
    };
    loadGame();
  }, [blogSlug]);

  const handleDownload = () => {
    if (!game || isDownloading) return;
    setIsDownloading(true);
    sessionStorage.setItem("downloadGameImage", game.image_url || "");
    setTimeout(() => {
      navigate(`/Download?game=${encodeURIComponent(game.title)}`);
      setIsDownloading(false);
    }, 1200);
  };

  const blogUrl = game ? `/blog/how-to-download-${game.slug}-on-mobile-for-free` : "";
  const fullUrl = `${window.location.origin}${blogUrl}`;

  const structuredData = game
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to Download ${game.title} Mod APK 2026 on Mobile for Free`,
        description: game.description,
        step: [
          {
            "@type": "HowToStep",
            name: "Download the Mod APK",
            text: "Click the Download Now button and wait for the file to download.",
          },
          {
            "@type": "HowToStep",
            name: "Enable Unknown Sources",
            text: "Go to Settings → Security → Install unknown apps (or similar).",
          },
          {
            "@type": "HowToStep",
            name: "Install the APK",
            text: "Open the downloaded file and tap Install.",
          },
        ],
      }
    : {};

  return (
    <>
      <Helmet>
        <title>
          {game
            ? `How to Download ${game.title} Mod APK 2026 on Mobile for Free | WeLoveMods`
            : "Loading Guide..."}
        </title>
        <meta
          name="description"
          content={`Step-by-step guide to download ${game?.title} Mod APK 2026 for free on Android & iOS. Unlimited money, unlocked levels, ad-free. Safe & fast download.`}
        />
        <link rel="canonical" href={fullUrl} />
        <meta
          property="og:title"
          content={`How to Download ${game?.title} Mod APK 2026 on Mobile for Free`}
        />
        <meta property="og:description" content={game?.description || ""} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BlogSkeleton />
          </motion.div>
        ) : !game ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#FFFBEB] flex flex-col items-center justify-center px-4 text-center"
          >
            <AlertCircle className="w-20 h-20 text-amber-500 mb-6" />
            <h1 className="text-4xl font-black text-slate-900">Guide Not Found</h1>
            <button
              onClick={() => navigate("/")}
              className="mt-8 px-12 py-5 bg-blue-600 text-white font-black text-lg uppercase tracking-widest rounded-2xl shadow-xl hover:bg-blue-700 transition"
            >
              Back to Home
            </button>
          </motion.div>
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-[#FFFBEB] pb-16 px-4 pt-6 font-sans"
          >
            <div className="max-w-4xl mx-auto space-y-10">
              {/* Back button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-amber-600 font-black uppercase tracking-widest text-xs transition"
              >
                <ArrowLeft size={16} strokeWidth={3} /> Back to Mods
              </button>

              {/* Hero Section */}
              <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-slate-100 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="md:w-2/5">
                    <div className="relative">
                      <img
                        src={game.image_url}
                        alt={`${game.title} Mod APK 2026 cover`}
                        className="w-full aspect-square object-cover rounded-[2rem] border-4 border-[#FFFBEB] shadow-xl"
                      />
                      <div className="absolute -bottom-3 -right-3 bg-emerald-500 p-2 rounded-full border-4 border-white shadow-lg">
                        <ShieldCheck size={24} className="text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="md:w-3/5 space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
                      How to Download {game.title} Mod APK 2026 on Mobile for Free
                    </h1>

                    <div className="flex gap-3 flex-wrap">
                      <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-black text-xs border border-amber-200">
                        Premium Mod
                      </span>
                      <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full font-black text-xs border border-slate-200">
                        {game.downloads.toLocaleString()} Downloads
                      </span>
                      <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-black text-xs">
                        v{game.version}
                      </span>
                    </div>

                    <p className="text-lg text-slate-700 font-bold leading-relaxed">{game.description}</p>

                    {/* Top Download Button */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-black text-xl sm:text-2xl uppercase tracking-widest rounded-3xl py-6 sm:py-7 shadow-2xl shadow-green-500/40 relative overflow-hidden transition"
                    >
                      <Download size={28} className={isDownloading ? "animate-bounce" : ""} />
                      {isDownloading ? "PREPARING DOWNLOAD..." : "DOWNLOAD NOW – FREE"}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine pointer-events-none" />
                    </motion.button>

                    <p className="text-center text-slate-500 text-xs italic">
                      Safe APK • No Virus • Instant Download
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="prose prose-slate max-w-none space-y-12 text-lg leading-relaxed">
                <section>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <Zap size={28} className="text-amber-500" /> Why Download {game.title} Mod APK?
                  </h2>
                  <p>
                    Unlock unlimited money, gems, lives, ad-free gameplay, and all premium features for free. Our {game.title} Mod APK 2026 is 100% safe, updated monthly, and works on all Android & iOS devices.
                  </p>
                </section>

                <section className="py-6 space-y-6">
                  <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="p-2.5 bg-amber-100 rounded-lg">
                      <Smartphone size={28} className="text-amber-600" />
                    </div>
                    Requirements
                  </h2>

                  <ul className="grid gap-4 sm:grid-cols-3 list-none">
                    <li className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition">
                      <CheckCircle size={24} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">Android, iOS & PC</span>
                    </li>
                    <li className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition">
                      <CheckCircle size={24} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">100 MB free storage</span>
                    </li>
                    <li className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition">
                      <CheckCircle size={24} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">Allow unknown sources (Android)</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <Clock size={28} className="text-amber-500" /> Step-by-Step Installation Guide (2026 Updated)
                  </h2>
                  <ol className="space-y-8 list-decimal pl-8 mt-4">
                    <li>
                      <strong>Step 1:</strong> Click the "DOWNLOAD NOW" button above and wait for the APK file to finish downloading.
                    </li>
                    <li>
                      <strong>Step 2:</strong> Go to Settings → Apps → Special app access → Install unknown apps → Allow your browser.
                    </li>
                    <li>
                      <strong>Step 3:</strong> Open the downloaded file and tap Install. The mod will install in seconds.
                    </li>
                    <li>
                      <strong>Step 4:</strong> Open the app and enjoy unlimited everything!
                    </li>
                  </ol>
                </section>

                <section>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                    Unlocked Features in This Mod
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {game.features?.map((f, i) => (
                      <div
                        key={i}
                        className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-bold text-lg">{f}</p>
                          <p className="text-slate-600">Fully unlocked in this version</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-8 mt-6">
                    <div>
                      <h3 className="font-bold text-xl">Is this {game.title} Mod APK safe?</h3>
                      <p className="mt-2">
                        Yes. Every file is scanned with multiple antivirus engines. No virus, malware, or ads.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Will my progress be saved?</h3>
                      <p className="mt-2">
                        Yes. Cloud sync works perfectly with the mod version.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Sticky Bottom Download Button */}
              <div className="sticky bottom-8 z-50 md:static md:bottom-auto mt-12">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-black text-xl sm:text-2xl uppercase tracking-widest rounded-3xl py-6 sm:py-7 shadow-2xl shadow-green-500/40 relative overflow-hidden transition"
                >
                  <Download size={28} className={isDownloading ? "animate-bounce" : ""} />
                  DOWNLOAD {game.title.toUpperCase()} MOD APK NOW
                </motion.button>
                <p className="text-center text-[10px] sm:text-xs text-slate-500 mt-2">
                  Fast • Free • No Registration
                </p>
              </div>
            </div>

            {/* Shine Animation Keyframes */}
            <style>{`
              @keyframes shine {
                0% { transform: translateX(-100%) skewX(-20deg); }
                100% { transform: translateX(300%) skewX(-20deg); }
              }
              .animate-shine { animation: shine 3s infinite; }
            `}</style>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
});

export default GameBlog;