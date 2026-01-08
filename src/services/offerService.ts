export interface Offer {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Standard";
  timeEstimate: string;
  icon: string;
  url: string;
  image?: string;
  type?: string;
  epc: number;
  payout: number;
  cpa: number;
  score: number;
  isHighCR: boolean;
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
const FALLBACK = "https://appinstallcheck.com/cl/i/8dkk3k";

/* ──────────────────────────────────────────────────────────────
   REEL PRO CONFIGURATION
   ────────────────────────────────────────────────────────────── */
const PRO_CONFIG = {
  MIN_PAYOUT: 0.85,        // Floor to ignore low-paying offers
  MIN_EPC: 0.20,           // Floor to ignore dead/non-converting offers
  CTYPE: "1",             // Forced to 1 (CPI/App Installs) for high conversion
  API_MAX: "15",          // Scan 15 offers to find the top 3 bangers
  WEIGHT_CR: 0.85,        // Efficiency Weight (EPC vs Payout ratio)
  WEIGHT_RAW: 0.15        // Raw EPC Weight
};

/* ──────────────────────────────────────────────────────────────
   CORE PERFORMANCE ENGINE
   ────────────────────────────────────────────────────────────── */

const getDeviceType = () => {
  if (typeof window === "undefined") return "android";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("iphone") || ua.includes("ipad")) return "ios";
  return "android";
};

const getIP = async (): Promise<string> => {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const j = await r.json();
    return j.ip ?? "1.1.1.1";
  } catch { return "1.1.1.1"; }
};

const parseNumber = (v?: string): number => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

/**
 * REEL PRO SCORER
 * Prioritizes "Tight" offers where EPC is closest to the Payout.
 */
const calculateProScore = (epc: number, payout: number): number => {
  if (payout <= 0 || epc <= 0) return 0;
  const cr = epc / payout; // Real Conversion Rate
  return (cr * PRO_CONFIG.WEIGHT_CR) + (epc * PRO_CONFIG.WEIGHT_RAW);
};

/* ──────────────────────────────────────────────────────────────
   REEL PRO MAPPER
   ────────────────────────────────────────────────────────────── */
const mapOffer = (o: ApiOffer, i: number): Offer => {
  const epc = parseNumber(o.epc);
  const payout = parseNumber(o.payout);
  const cr = payout > 0 ? epc / payout : 0;

  // Real-time difficulty logic: High CR = Easy/Fast
  const isFastTrack = cr > 0.35;

  return {
    id: o.offerid ?? `pro-${i}-${Math.random().toString(36).substring(2, 7)}`,
    title: o.name_short || o.name || "System Verification",
    description: o.adcopy || o.description || "Complete this certified task to verify your session.",
    difficulty: isFastTrack ? "Easy" : "Standard",
    timeEstimate: isFastTrack ? "25s" : "45s",
    icon: isFastTrack ? "Zap" : "ShieldCheck",
    url: o.link?.startsWith("http") ? o.link : FALLBACK,
    image: o.picture,
    type: o.category,
    epc,
    payout,
    cpa: parseNumber(o.cpa) || payout,
    score: calculateProScore(epc, payout),
    isHighCR: isFastTrack
  };
};

/* ──────────────────────────────────────────────────────────────
   THE FILTER ENGINE (fetchOffers)
   ────────────────────────────────────────────────────────────── */
export const fetchOffers = async (): Promise<Offer[]> => {
  try {
    const ip = await getIP();
    const device = getDeviceType();

    const params = new URLSearchParams({
      ip,
      user_agent: navigator.userAgent,
      ctype: PRO_CONFIG.CTYPE,
      max: PRO_CONFIG.API_MAX,
      device: device
    });

    const response = await fetch(`${API_URL}?${params}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store'
    });

    if (!response.ok) return [];
    const data: ApiOfferResponse = await response.json();
    const raw = data.offers ?? [];

    // 1. Map all offers to Pro interface
    const mapped = raw.map(mapOffer);

    // 2. Strict Banger Filter (Remove trash)
    const bangers = mapped.filter(o => (
      o.payout >= PRO_CONFIG.MIN_PAYOUT && 
      o.epc >= PRO_CONFIG.MIN_EPC &&
      o.epc <= o.payout // Data sanity check
    ));

    // 3. Sort by Pro Score (Conversion Velocity)
    const sorted = bangers.sort((a, b) => b.score - a.score);

    // 4. Return Top 1 to 3
    if (sorted.length > 0) {
      return sorted.slice(0, 3);
    }

    // Fallback: If no strict bangers, show top 2 unique by raw EPC
    return Array.from(new Map(mapped.map(o => [o.id, o])).values())
      .sort((a, b) => b.epc - a.epc)
      .slice(0, 2);

  } catch (error) {
    console.error("Pro Engine Failure:", error);
    return [];
  }
};

/* ──────────────────────────────────────────────────────────────
   TOP OFFER (Hero Section)
   ────────────────────────────────────────────────────────────── */
export const getTopOffer = async (): Promise<Offer | null> => {
  const offers = await fetchOffers();
  return offers.length > 0 ? offers[0] : null;
};