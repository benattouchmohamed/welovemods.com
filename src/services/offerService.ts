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
}

interface ApiOfferResponse {
  success?: boolean;
  error?: string | null;
  offers?: ApiOffer[];
}

// ────── Config ──────
const API_BASE_URL = "https://unlockcontent.net/api/v2";
const API_TOKEN = "32448|19Qy5BpANljlYzaK2NZLyV2WjChiAMUXR28Zd6lqb4757085";
const FALLBACK_URL = "https://areyourealhuman.com/cl/i/g6pqp2";
const CTYPE_CPI = 1;

// ────── Helpers ──────
const getVisitorIP = async (): Promise<string> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const r = await fetch("https://api.ipify.org?format=json", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const d = await r.json();
    return d.ip ?? "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
};

const parseFloatOrNull = (val?: string): number | null =>
  val && !isNaN(parseFloat(val)) ? parseFloat(val) : null;

const mapApiOfferToOffer = (api: ApiOffer, idx: number): Offer => {
  const url = api.link && /^https?:\/\//i.test(api.link) ? api.link : FALLBACK_URL;
  return {
    id: api.offerid ?? `offer-${idx}`,
    title: api.name_short ?? api.name ?? "Special Offer",
    description: api.adcopy ?? api.description ?? "Complete this quick offer to continue",
    difficulty: "Easy",
    timeEstimate: "1-2 mins",
    icon: "Gift",
    url,
    image: api.picture,
    type: api.category,
    epc: parseFloatOrNull(api.epc) ?? 0,
    payout: parseFloatOrNull(api.payout) ?? 0,
  };
};

const sortWithCPIPriority = (
  a: { offer: Offer; idx: number },
  b: { offer: Offer; idx: number }
): number => {
  const typeA = a.offer.type?.toUpperCase() || "";
  const typeB = b.offer.type?.toUpperCase() || "";

  const isCPI_A = typeA.includes("CPI");
  const isCPI_B = typeB.includes("CPI");

  // 1. CPI Priority
  if (isCPI_A && !isCPI_B) return -1;
  if (!isCPI_A && isCPI_B) return 1;

  // 2. EPC Priority
  const epcA = a.offer.epc ?? -Infinity;
  const epcB = b.offer.epc ?? -Infinity;
  if (epcA !== epcB) return epcB - epcA;

  // 3. Payout Priority
  const payoutA = a.offer.payout ?? -Infinity;
  const payoutB = b.offer.payout ?? -Infinity;
  if (payoutA !== payoutB) return payoutB - payoutA;

  // 4. Original Order
  return a.idx - b.idx;
};

// ────── Main Functions ──────

/**
 * Fetches offers, filters for performance (EPC >= 0.5), 
 * and sorts by CPI priority and profitability.
 */
export const fetchOffers = async (): Promise<Offer[]> => {
  try {
    const visitorIP = await getVisitorIP();
    const userAgent = navigator.userAgent;

    const headers = {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    };

    const timeoutSignal =
      typeof AbortSignal.timeout === "function"
        ? AbortSignal.timeout(10000)
        : (() => {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 10000);
            return controller.signal;
          })();

    const params = new URLSearchParams({
      ip: visitorIP,
      user_agent: userAgent,
      ctype: CTYPE_CPI.toString(),
      min: "5",
      max: "15", // Request more to ensure we have enough after filtering
    });

    const response = await fetch(`${API_BASE_URL}?${params}`, {
      method: "GET",
      headers,
      signal: timeoutSignal,
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data: ApiOfferResponse = await response.json();

    if (!data.success || !data.offers) return [];

    return data.offers
      .map((apiOffer, index) => ({
        offer: mapApiOfferToOffer(apiOffer, index),
        idx: index,
      }))
      // Filter: Only keep offers with EPC >= 0.5
      .filter((item) => (item.offer.epc ?? 0) >= 0.05)
      // Sort: CPI -> EPC -> Payout
      .sort(sortWithCPIPriority)
      // Take Top 3
      .slice(0, 1)
      .map((item) => item.offer);

  } catch (error) {
    console.error("fetchOffers failed:", error);
    return [];
  }
};

/**
 * Returns only the single best offer based on the sorting logic.
 */
export const getTopOffer = async (): Promise<Offer | null> => {
  const offers = await fetchOffers();
  return offers.length > 0 ? offers[0] : null;
};