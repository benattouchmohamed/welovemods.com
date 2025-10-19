import { Star } from "lucide-react";

export interface Game {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  rating: number;
  version: string;
  isMod: boolean;
  isPremium: boolean;
  isNew?: boolean;
  isHot?: boolean;
  downloads: number;
  description: string;
  features: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}


export const categories: Category[] = [
  { id: "1", name: "Action", icon: "🎮", color: "bg-red-500" },
  { id: "2", name: "Adventure", icon: "🌍", color: "bg-green-500" },
 
  { id: "4", name: "  Puzzle", icon: "🎲", color: "bg-blue-500" },

  { id: "11", name: "RPG", icon: "🛡️", color: "bg-cyan-500" },
  { id: "12", name: "NOBA", icon: "🌆", color: "bg-emerald-500" },
 
  { id: "14", name: "Strategy", icon: "♟️", color: "bg-orange-500" },
 
];

export const getStarsData = (rating: number) => {
  const starsData = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    starsData.push({ type: 'full', id: `star-${i}` });
  }

  if (hasHalfStar) {
    starsData.push({ type: 'half', id: 'half-star' });
  }

  const emptyStars = 5 - starsData.length;
  for (let i = 0; i < emptyStars; i++) {
    starsData.push({ type: 'empty', id: `empty-star-${i}` });
  }

  return starsData;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};
