export interface Offer {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy";
  timeEstimate: string;
  icon: string;
  url: string;
  image?: string;
  type?: string;
  epc?: number;
  payout?: number;
  cpa?: number;
  score?: number;
}

interface ApiOffer {
  offerid?: string;
  name?: string;
  name_short?: string;
  description?: string;
  adcopy?: string;
  picture?: string;
  payout?: string;
  link?: string;
  epc?: string;
  category?: string;
  cpa?: string;
}

interface ApiOfferResponse {
  success?: boolean;
  error?: string | null;
  offers?: ApiOffer[];
}

const API_URL = "https://unlockcontent.net/api/v2";
const TOKEN = "32448|19Qy5BpANljlYzaK2NZLyV2WjChiAMUXR28Zd6lqb4757085";
const FALLBACK = "https://areyourealhuman.com/cl/i/g6pqp2";

/* ------------------ PRO CONFIGURATION ------------------ */

const PRO_CONFIG = {
  MIN_PAYOUT: 0.80,       // Global filter: ignore low payout
  MIN_EPC: 0.10,          // Global filter: ignore low conversion
  API_MIN: "2",           // API level constraint
  API_MAX: "12",          // Increased fetch count to ensure we find PIN offers in the mix
  WEIGHT_EPC: 0.75,       // Focus on conversion
  WEIGHT_PAYOUT: 0.25,    // Focus on dollar amount
  PIN_BOOST: 0.20         // Priority boost for PIN submits with good EPC
};

/* ------------------ HELPERS ------------------ */

const getDeviceType = () => {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("iphone") || ua.includes("ipad")) return "ios";
  if (ua.includes("android")) return "android";
  return "desktop";
};

const getIP = async (): Promise<string> => {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const j = await r.json();
    return j.ip ?? "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
};

const parseNumber = (v?: string): number => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

/**
 * Advanced Scoring: Prioritizes EPC but scales with Payout.
 * Logic: If it's a PIN offer and EPC is better than average, it gets a score boost.
 */
const calculatePerformanceScore = (epc: number, payout: number, category?: string): number => {
  const normEpc = Math.min(epc / 0.8, 1.5); 
  const normPayout = Math.min(payout / 4.0, 1.5);
  let score = (normEpc * PRO_CONFIG.WEIGHT_EPC) + (normPayout * PRO_CONFIG.WEIGHT_PAYOUT);

  // Apply PIN Priority: If category contains PIN and has decent EPC, boost it
  const isPin = category?.toUpperCase().includes("PIN");
  if (isPin && epc >= PRO_CONFIG.MIN_EPC) {
    score += PRO_CONFIG.PIN_BOOST;
  }

  return score;
};

/* ------------------ MAPPERS ------------------ */

const mapOffer = (o: ApiOffer, i: number): Offer => {
  const epc = parseNumber(o.epc);
  const payout = parseNumber(o.payout);
  return {
    id: o.offerid ?? `offer-${i}`,
    title: o.name_short ?? o.name ?? "Premium Offer",
    description: o.adcopy ?? o.description ?? "Complete this simple task to continue.",
    difficulty: "Easy",
    timeEstimate: "1 min",
    icon: "Gift",
    url: o.link?.startsWith("http") ? o.link : FALLBACK,
    image: o.picture,
    type: o.category,
    epc,
    payout,
    cpa: parseNumber(o.cpa) || payout,
    score: calculatePerformanceScore(epc, payout, o.category)
  };
};

/* ------------------ API ------------------ */

const fetchAllOffersFromApi = async (): Promise<Offer[]> => {
  try {
    const ip = await getIP();
    const device = getDeviceType();

    const params = new URLSearchParams({
      ip,
      user_agent: navigator.userAgent,
      ctype: "15",              // 1 (CPI) + 2 (CPA) + 4 (PIN) + 8 (VID)
      min: PRO_CONFIG.API_MIN,
      max: PRO_CONFIG.API_MAX,  // Pull more so we can filter for the best PINs
      device: device !== "desktop" ? device : "" 
    });

    const r = await fetch(`${API_URL}?${params}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (!r.ok) return [];
    const j: ApiOfferResponse = await r.json();
    return (j.offers ?? []).map(mapOffer);
  } catch {
    return [];
  }
};

/* ------------------ THE FILTER ENGINE ------------------ */

export const fetchOffers = async (): Promise<Offer[]> => {
  const all = await fetchAllOffersFromApi();

  // 1. Remove duplicates
  const unique = Array.from(new Map(all.map(o => [o.id, o])).values());

  // 2. Pro Filter: Remove high-payout but broken offers
  const qualityOffers = unique.filter(o => {
    const p = o.payout ?? 0;
    const e = o.epc ?? 0;
    
    // If payout is > $2.00 and EPC is dead (< 0.04), it's a fake/broken offer
    if (p > 2.0 && e < 0.04) return false;
    
    return p >= PRO_CONFIG.MIN_PAYOUT && e >= PRO_CONFIG.MIN_EPC;
  });

  // 3. Sort by Score (Score already includes PIN boost)
  const sorted = qualityOffers.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  // 4. Fallback Selection
  if (sorted.length < 2) {
    return unique
      .sort((a, b) => (b.epc ?? 0) - (a.epc ?? 0))
      .slice(0, 3);
  }

  return sorted.slice(0, 3);
};

/* ------------------ TOP OFFER ------------------ */

export const getTopOffer = async (): Promise<Offer | null> => {
  const offers = await fetchOffers();
  return offers.length > 0 ? offers[0] : null;
};