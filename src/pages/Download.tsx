import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Clock,
  DollarSign,
  Smartphone,
  Monitor,
  Gamepad2,
  Gift,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { fetchOffers, type Offer } from "@/services/offerService";

const Download = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameName = searchParams.get("game") || "Game";
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const fetchedOffers = await fetchOffers();
        setOffers(fetchedOffers);
      } catch (error) {
        console.error("Failed to fetch offers:", error);
        setError("Failed to load offers. Try the link below.");
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Smartphone":
        return <Smartphone className="w-8 h-8 text-cartoon-cream" />;
      case "Monitor":
        return <Monitor className="w-8 h-8 text-cartoon-cream" />;
      case "Gamepad2":
        return <Gamepad2 className="w-8 h-8 text-cartoon-cream" />;
      case "Gift":
        return <Gift className="w-8 h-8 text-cartoon-cream" />;
      default:
        return <DollarSign className="w-8 h-8 text-cartoon-cream" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cartoon-cream/10 to-white">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {loading ? (
            <div className="flex justify-center items-center h-[40vh]">
              <div className="w-16 h-16 border-4 border-cartoon-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-cartoon-red font-bold">
              {error}
              <a
                href="https://appinstallcheck.com/cl/i/8dkk3k"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-cartoon-blue to-cartoon-purple text-cartoon-cream font-black py-3 px-6 rounded-full text-center hover:shadow-lg transition-all hover:-translate-y-1 mt-4 max-w-sm mx-auto"
              >
                Try Offers Here
              </a>
            </div>
          ) : (
            <>
              {/* Instructions Block */}
              <div className="bg-gradient-to-b from-cartoon-cream to-white border-4 border-cartoon-blue rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,255,0.2)] mb-10 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-cartoon-blue mb-3 drop-shadow-sm leading-tight">
                  Unlock{" "}
                  <span className="fancy-span text-cartoon-purple break-words">{gameName}</span>
                </h1>

                <p className="text-lg font-bold mb-3 text-cartoon-blue">
                  Complete{" "}
                  <span className="fancy-span text-cartoon-green">1 offer</span>{" "}
                  to unlock and get the{" "}
                  <span className="fancy-span text-cartoon-orange">game</span>.
                </p>

                <p className="text-lg font-bold mb-3 text-cartoon-blue">
                  Once you finish{" "}
                  <span className="fancy-span text-cartoon-green">1 offer</span>
                  , your download will start{" "}
                  <span className="fancy-span text-cartoon-red">automatically!</span>
                </p>

                <div className="flex flex-col items-center justify-center gap-3 text-cartoon-blue mt-6">
                  <span className="fancy-span font-bold text-lg bg-cartoon-cream border border-cartoon-blue px-4 py-1 rounded-full shadow-sm">
                    0/1 offer completed
                  </span>

                  {/* Guide Button */}
                  <button
                    onClick={() => setShowGuide(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <span>How to Complete Offers Guide</span>
                  </button>
                </div>
                
              </div>

              

              {/* Guide Popup */}
              {showGuide && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                  <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                    <button
                      onClick={() => setShowGuide(false)}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 transition-colors"
                    >
                      X
                    </button>
                    <img
                      src="/images/guide.png"
                      alt="How to Complete Offers Guide"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Offers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {offers.map((offer, index) => (
                  <div
                    key={offer.id}
                    className={`bg-cartoon-cream border-4 ${
                      index % 2 === 0
                        ? "border-cartoon-purple shadow-[0_8px_0_#a855f7]"
                        : "border-cartoon-pink shadow-[0_8px_0_#ec4899]"
                    } rounded-3xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 duration-200`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-1 rounded-xl w-20 h-20 flex items-center justify-center bg-cartoon-pink shadow-md">
                        {offer.image ? (
                          <img
                            src={offer.image}
                            alt={offer.title}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          getIconComponent(offer.icon)
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-cartoon-red mb-2">
                          {offer.title}
                        </h3>
                        <p className="text-cartoon-blue mb-3 leading-relaxed text-sm">
                          {offer.description}
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1 text-cartoon-blue">
                            <Clock className="w-4 h-4" />
                            <span className="font-bold text-sm">
                              {offer.timeEstimate}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-cartoon-green">
                            <span className="font-bold text-sm">
                              {offer.difficulty}
                            </span>
                          </div>
                        </div>
                        <a
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-gradient-to-r from-cartoon-blue to-cartoon-purple text-cartoon-cream font-black py-3 px-6 rounded-full text-center hover:shadow-lg transition-all hover:-translate-y-1 duration-200"
                        >
                          Complete Offer
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Waiting Block */}
              <div className="bg-gradient-to-r from-cartoon-red to-cartoon-pink border-4 border-cartoon-red rounded-3xl p-6 shadow-[0_8px_0_#dc2626] text-center">
                <p className="text-cartoon-cream/90 font-bold mb-4 text-lg">
                  Finish your offer to download!
                </p>
                <span className="inline-block bg-gradient-to-r from-cartoon-blue to-cartoon-purple/50 text-cartoon-cream font-black py-3 px-6 rounded-full opacity-50 cursor-not-allowed">
                  Waiting for completion
                  <span className="inline-block ml-1 animate-[pulse_1.5s_ease-in-out_infinite]">
                    ...
                  </span>
                  <br />
                </span>
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