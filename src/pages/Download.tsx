import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Smartphone,
  Monitor,
  Gamepad2,
  Gift,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { fetchOffers, type Offer } from "@/services/offerService";

const Download = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameName = searchParams.get("game") || "Game";
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      <main className="pt-20 pb-6">
        <div className="container mx-auto px-4 max-w-4xl">
          {loading ? (
            // Show only spinner while loading
            <div className="flex justify-center items-center h-[40vh]">
              <div className="w-16 h-16 border-4 border-cartoon-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            // Show only error if fetch fails
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
              {/* Instructions show only after offers are loaded */}
              <div className="bg-cartoon-cream border-4 border-cartoon-blue rounded-3xl p-6 shadow-blue mb-8 text-center">
                <h1 className="text-3xl lg:text-4xl font-black text-cartoon-red mb-4">
                  Download <span className="fancy-span">{gameName}</span> Now!
                </h1>
                <p className="text-lg font-bold mb-2 text-cartoon-black">
                  This game is{" "}
                  <span className="fancy-span text-cartoon-black">locked</span>!
                  Complete{" "}
                  <span className="fancy-span text-cartoon-green">2 offers</span>{" "}
                  to get the{" "}
                  <span className="fancy-span text-cartoon-purple">game</span>.
                </p>
                <p className="text-lg font-bold mb-2 text-cartoon-orange">
                  <span className="fancy-span text-cartoon-orange">
                    Support me
                  </span>{" "}
                  and in return you get the{" "}
                  <span className="fancy-span text-cartoon-blue">game</span>.
                </p>
                <p className="text-lg font-bold mb-4 text-cartoon-black">
                  <span className="fancy-span text-cartoon-green">
                    When you complete
                  </span>{" "}
                  <span className="fancy-span text-cartoon-red">2 offers</span>,
                  the{" "}
                  <span className="fancy-span text-cartoon-purple">game</span>{" "}
                  will start{" "}
                  <span className="fancy-span text-cartoon-blue font-black">
                    automatically
                  </span>{" "}
                  and be{" "}
                  <span className="fancy-span text-cartoon-pink">downloaded</span>
                  !
                </p>
                <div className="flex items-center justify-center gap-2 text-cartoon-green">
                  <span className="fancy-span font-bold">
                    0/2 offers completed
                  </span>
                </div>
              </div>

              {/* Offers grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {offers.map((offer, index) => (
                  <div
                    key={offer.id}
                    className={`bg-cartoon-cream border-4 ${
                      index === 0
                        ? "border-cartoon-purple shadow-purple"
                        : "border-cartoon-pink shadow-pink"
                    } rounded-3xl p-6 hover:shadow-lg transition-all hover:-translate-y-1`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-1 rounded-xl w-20 h-20 flex items-center justify-center bg-cartoon-pink">
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
                        <p className="text-cartoon-blue mb-3 leading-relaxed">
                          {offer.description}
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1 text-cartoon-blue">
                            <Clock className="w-4 h-4 text-cartoon-blue" />
                            <span className="fancy-span font-bold text-sm text-cartoon-blue">
                              {offer.timeEstimate}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-cartoon-green">
                            <span className="fancy-span font-bold text-sm text-cartoon-green">
                              {offer.difficulty}
                            </span>
                          </div>
                        </div>
                        <a
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-gradient-to-r from-cartoon-blue to-cartoon-purple text-cartoon-cream font-black py-3 px-6 rounded-full text-center hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                          Complete Offer
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Waiting block */}
              <div className="bg-gradient-to-r from-cartoon-red to-cartoon-pink border-4 border-cartoon-red rounded-3xl p-6 shadow-red text-center">
                <p className="text-cartoon-cream/90 font-bold mb-4">
                  Complete 2 offers to download!
                </p>
                <span className="block bg-gradient-to-r from-cartoon-blue to-cartoon-purple/50 text-cartoon-cream font-black py-3 px-6 rounded-full text-center opacity-50 cursor-not-allowed">
                  Waiting to Complete
                  <span className="inline-block ml-1 animate-[pulse_1.5s_ease-in-out_infinite]">
                    ...
                  </span>
                </span>
              </div>
              <br />
              <br />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Download;
