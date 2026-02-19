import React, { useEffect, useState, memo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  ChevronDown,
  Info
} from "lucide-react";
import { fetchGameBySlug, type Game } from "@/services/gameService";

// --- Neobrutalist Skeleton ---
const BlogSkeleton = () => (
  <div className="min-h-screen bg-[#FDF4D3] px-4 py-8">
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      <div className="h-6 w-48 bg-gray-300 rounded border-2 border-black" />
      <div className="h-64 bg-white border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
      <div className="h-96 bg-white border-4 border-black rounded-[2rem]" />
    </div>
  </div>
);

const GameBlog = memo(() => {
  const { blogSlug } = useParams<{ blogSlug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

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
        console.error("Fetch error:", err);
      } finally {
        setTimeout(() => setLoading(false), 600);
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
    }, 1800);
  };

  if (loading) return <BlogSkeleton />;
  if (!game) return (
    <div className="min-h-screen bg-[#FDF4D3] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-black bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase">Guide Not Found</h1>
      <Link to="/" className="mt-6 font-black underline uppercase text-xl">Go Home</Link>
    </div>
  );

  // SEO Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        "name": `How to Download ${game.title} Mod APK 2026`,
        "description": game.description,
        "image": game.image_url,
        "step": [
          { "@type": "HowToStep", "text": "Click Download Now button.", "name": "Start Download" },
          { "@type": "HowToStep", "text": "Enable Unknown Sources in settings.", "name": "Settings Update" },
          { "@type": "HowToStep", "text": "Install the APK file.", "name": "Installation" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Is the ${game.title} Mod safe?`,
            "acceptedAnswer": { "@type": "Answer", "text": "Yes, our files are scanned for malware and viruses daily." }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>How to Download {game.title} Mod APK 2026 Free on Mobile</title>
        <meta name="description" content={`Download ${game.title} Mod APK for Android and iOS. Get ${game.features?.join(', ')} for free. Safe and fast 2026 download guide.`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <main className="min-h-screen bg-[#FDF4D3] pb-20 px-4 pt-24 font-sans text-black">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* 1. SEO Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white w-fit px-3 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Link to="/" className="hover:text-[#FF814D]">Home</Link>
            <span>/</span>
            <Link to="/categories" className="hover:text-[#FF814D]">Mods</Link>
            <span>/</span>
            <span className="text-gray-400">{game.title}</span>
          </nav>

          {/* 2. Hero Section */}
          <div className="bg-white border-4 border-black rounded-[2.5rem] p-6 sm:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="md:w-1/3">
                <div className="relative">
                  <img src={game.image_url} alt={`${game.title} Mod APK`} className="w-full aspect-square object-cover rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,129,77,1)]" />
                  <div className="absolute -bottom-4 -right-4 bg-[#4FB39A] p-3 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <ShieldCheck size={28} />
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 space-y-6 text-center md:text-left">
                <h1 className="text-4xl sm:text-6xl font-black uppercase italic leading-[0.9] tracking-tighter">
                  {game.title} <span className="text-[#FF814D]">Mod APK</span> Download
                </h1>
                <p className="text-xl font-bold text-gray-700 leading-tight">{game.description}</p>
                
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`w-full py-6 rounded-[2rem] border-4 border-black font-black text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${isDownloading ? 'bg-gray-200 shadow-none translate-y-1' : 'bg-[#FF814D] hover:-translate-y-1'}`}
                >
                  {isDownloading ? "PREPARING APK..." : "DOWNLOAD NOW – FREE"}
                </motion.button>
              </div>
            </div>
          </div>

          {/* 3. Tech Specs Table (SEO Gold) */}
          <section className="bg-white border-4 border-black rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-black text-white p-4 font-black uppercase text-center tracking-widest flex items-center justify-center gap-2">
              <Info size={20} /> Application Information
            </div>
            <div className="grid grid-cols-2 text-sm sm:text-lg font-black uppercase">
              <div className="p-4 border-b-2 border-r-2 border-black bg-gray-50">App Name</div>
              <div className="p-4 border-b-2 border-black">{game.title} Mod</div>
              <div className="p-4 border-b-2 border-r-2 border-black bg-gray-50">Version</div>
              <div className="p-4 border-b-2 border-black">{game.version}</div>
              <div className="p-4 border-r-2 border-black bg-gray-50">Status</div>
              <div className="p-4 text-emerald-600">Working / Updated</div>
            </div>
          </section>

          {/* 4. Pros & Cons (SEO Comparison) */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#E7F9F3] border-4 border-black p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(79,179,154,1)]">
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2"><CheckCircle className="text-[#4FB39A]" /> Mod Benefits</h3>
              <ul className="space-y-2 font-bold opacity-80">
                {game.features?.map((f, i) => <li key={i}>✓ {f}</li>)}
                <li>✓ 100% Anti-Ban Protection</li>
              </ul>
            </div>
            <div className="bg-[#FFF1F1] border-4 border-black p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(255,112,112,1)]">
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2"><AlertCircle className="text-red-500" /> Disadvantages</h3>
              <ul className="space-y-2 font-bold opacity-80">
                <li>✗ Manual Update Required</li>
                <li>✗ Not on Play Store</li>
              </ul>
            </div>
          </div>

          {/* 5. Installation Guide */}
          <section className="bg-white border-4 border-black p-8 sm:p-12 rounded-[3rem] shadow-[12px_12px_0px_0px_rgba(255,112,193,1)]">
            <h2 className="text-4xl font-black uppercase mb-10 text-center tracking-tighter">How to Install 2026 Guide</h2>
            <div className="space-y-8">
              {[
                { n: "01", t: "Download", d: "Click the big orange button above to start the secure download." },
                { n: "02", t: "Security", d: "Enable 'Unknown Sources' in your Android security settings." },
                { n: "03", t: "Launch", d: "Install the APK and launch the game to see all mod features." }
              ].map(step => (
                <div key={step.n} className="flex gap-6 items-start">
                  <div className="bg-black text-white w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-xl">{step.n}</div>
                  <div>
                    <h4 className="text-2xl font-black uppercase">{step.t}</h4>
                    <p className="text-lg font-bold text-gray-500">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. FAQ Section (People Also Ask) */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: `Is ${game.title} Mod APK safe for my phone?`, a: "Absolutely. We scan every file with VirusTotal and manual checks to ensure your data remains 100% safe." },
                { q: "Do I need to root my Android device?", a: "No, this Mod works perfectly on non-rooted devices and standard iOS versions." },
                { q: "How do I update the game?", a: "Simply visit WeLoveMods again for the latest version and install it over the old one." }
              ].map((item, i) => (
                <details key={i} className="group bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] open:bg-[#FDF4D3] transition-all">
                  <summary className="font-black uppercase flex justify-between items-center cursor-pointer list-none">
                    {item.q} <ChevronDown className="group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-4 pt-4 border-t-2 border-black font-bold text-gray-600">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
});

export default GameBlog;