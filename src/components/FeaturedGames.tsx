
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, Star } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { fetchGames } from "@/services/gameService";
import type { Game } from "@/services/gameService";

const FeaturedGames = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadGames = async () => {
      try {
        const gamesData = await fetchGames();
        // Filter for hot or new games
        const featured = gamesData.filter(game => 
          game.isHot || game.is_hot || game.isNew || game.is_new
        ).slice(0, 4);
        
        setFeaturedGames(featured);
      } catch (error) {
        console.error("Error loading featured games:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGames();
  }, []);
  
  useEffect(() => {
    if (featuredGames.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === featuredGames.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  if (isLoading) {
    return (
      <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl h-[450px] animate-pulse bg-gray-200">
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-500">Loading featured games...</span>
        </div>
      </div>
    );
  }

  if (featuredGames.length === 0) {
    return null;
  }

  return (
    <div className="relative mt-12 rounded-2xl overflow-hidden shadow-2xl">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent className="h-[450px] md:h-[550px]">
          {featuredGames.map((game, index) => (
            <CarouselItem key={game.id} className="h-full">
              <div className="relative h-full w-full">
                {/* Background image with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80 dark:from-black/50 dark:via-black/70 dark:to-black/90">
                  <img
                    src={game.imageUrl || game.image_url || "/placeholder.svg"}
                    alt={game.title}
                    className="h-full w-full object-cover opacity-60"
                  />
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                  <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                      {/* Game image */}
                      <div className="relative w-full md:w-1/3 lg:w-1/4 animate-slide-up card-highlight" style={{ animationDelay: '0.1s' }}>
                        <div className="aspect-[3/2] rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-300">
                          <img
                            src={game.imageUrl || game.image_url || "/placeholder.svg"}
                            alt={game.title}
                            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                          />
                        </div>
                        <div className="absolute top-3 left-3 flex space-x-2">
                          {(game.isMod || game.is_mod) && <span className="badge-mod shadow-lg">MOD</span>}
                          {(game.isNew || game.is_new) && <span className="badge-new shadow-lg">NEW</span>}
                          {(game.isHot || game.is_hot) && <span className="badge-hot shadow-lg">HOT</span>}
                        </div>
                      </div>
                      
                      {/* Game info */}
                      <div className="w-full md:w-2/3 lg:w-3/4 text-white animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="badge-primary shadow-sm">{game.category}</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-balance text-white">
                          {game.title}
                        </h2>
                        
                        <p className="text-white/90 max-w-2xl mb-5 text-lg">
                          {game.description}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                          <div className="glass rounded-lg p-3">
                            <p className="text-xs font-medium text-white/70 mb-1">Version</p>
                            <p className="font-semibold text-white">{game.version}</p>
                          </div>
                          <div className="glass rounded-lg p-3">
                            <p className="text-xs font-medium text-white/70 mb-1">Rating</p>
                            <p className="font-semibold text-white flex items-center">
                              {game.rating} <Star className="ml-1 w-4 h-4 text-yellow-400 fill-yellow-400" />
                            </p>
                          </div>
                          <div className="glass rounded-lg p-3">
                            <p className="text-xs font-medium text-white/70 mb-1">Downloads</p>
                            <p className="font-semibold text-white">{game.downloads.toLocaleString()}</p>
                          </div>
                          <div className="glass rounded-lg p-3">
                            <p className="text-xs font-medium text-white/70 mb-1">Size</p>
                            <p className="font-semibold text-white">84.3 MB</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <Link 
                            to={`/game/${game.id}`}
                            className="relative bg-gradient-to-r from-app-accent-blue to-app-purple hover:from-app-purple hover:to-app-accent-blue transition-all duration-500 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-app-purple/50 focus:ring-2 focus:ring-app-purple-light focus:ring-offset-2 focus:outline-none btn-glow flex items-center gap-2 overflow-hidden group"
                          >
                            <Download className="w-5 h-5 group-hover:animate-bounce" />
                            <span>Download Now</span>
                            <span className="absolute top-0 right-0 px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-bl-lg rounded-tr-lg">FREE</span>
                          </Link>
                          <Link 
                            to={`/game/${game.id}`}
                            className="bg-white/10 hover:bg-white/20 transition-all duration-300 px-6 py-3 rounded-full font-semibold backdrop-blur-sm border border-white/20 hover:border-white/40"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white border-none" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white border-none" />
      </Carousel>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {featuredGames.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125 shadow-glow" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedGames;
