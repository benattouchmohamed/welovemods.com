// =============================================
//  Offer Wall - CPI Priority + High EPC PIN
//  Last updated: January 2025
// =============================================

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

// ──────────────────────────────────────────────
//                  CONFIGURATION
// ──────────────────────────────────────────────

const API_BASE_URL = "https://unlockcontent.net/api/v2";
const API_TOKEN = "32448|19Qy5BpANljlYzaK2NZLyV2WjChiAMUXR28Zd6lqb4757085";
const FALLBACK_URL = "https://areyourealhuman.com/cl/i/g6pqp2";

// ctype flags (bitwise)
const CTYPE_CPI = 1;   // 0001
const CTYPE_PIN = 4;   // 0100

const MIN_EPC_OVERALL = 0.02;     // minimal quality filter
const MIN_EPC_FOR_PIN = 30;       // very high threshold for PIN offers

// ──────────────────────────────────────────────
//                   HELPERS
// ──────────────────────────────────────────────

const getVisitorIP = async (): Promise<string> => {
  try {
    const response = await fetch("https://api.ipify.org?format=json", {
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    return data.ip ?? "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
};

const parseFloatOrNull = (value?: string): number | null => {
  if (!value) return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

const mapApiOfferToOffer = (apiOffer: ApiOffer, index: number): Offer => {
  const url = apiOffer.link && /^https?:\/\//i.test(apiOffer.link)
    ? apiOffer.link
    : FALLBACK_URL;

  return {
    id: apiOffer.offerid ?? `offer-${index + 1}`,
    title: apiOffer.name_short ?? apiOffer.name ?? "Special Offer",
    description: apiOffer.adcopy ?? apiOffer.description ?? "Complete this quick task to continue",
    difficulty: "Easy" as const,
    timeEstimate: "1-3 mins",
    icon: "Gift",
    url,
    image: apiOffer.picture,
    type: apiOffer.category,
    epc: parseFloatOrNull(apiOffer.epc) ?? 0,
    payout: parseFloatOrNull(apiOffer.payout) ?? 0,
  };
};

// ──────────────────────────────────────────────
//               SORTING LOGIC
// ──────────────────────────────────────────────

function compareOffers(a: Offer, b: Offer): number {
  const typeA = (a.type ?? "").toUpperCase();
  const typeB = (b.type ?? "").toUpperCase();

  const isCPI_A = typeA.includes("CPI") || typeA.includes("APP");
  const isCPI_B = typeB.includes("CPI") || typeB.includes("APP");

  // 1. CPI offers always come first
  if (isCPI_A && !isCPI_B) return -1;
  if (!isCPI_A && isCPI_B) return 1;

  // 2. Then sort by EPC descending (very important for good PIN)
  if (a.epc !== b.epc) {
    return b.epc - a.epc;
  }

  // 3. Higher payout as tie-breaker
  if (a.payout !== b.payout) {
    return b.payout - a.payout;
  }

  // 4. Stable sort fallback
  return 0;
}

// ──────────────────────────────────────────────
//               MAIN FUNCTIONS
// ──────────────────────────────────────────────

/**
 * Fetches CPI offers + very high EPC PIN offers
 * CPI always prioritized in final sorting
 */
export const fetchOffers = async (
  minEpcForPin: number = MIN_EPC_FOR_PIN
): Promise<Offer[]> => {
  try {
    const ip = await getVisitorIP();
    const userAgent = navigator.userAgent;

    const headers = {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    };

    const commonParams = {
      ip,
      user_agent: userAgent,
      min: "3",
      max: "3",
    };

    // ── 1. CPI offers ────────────────────────────────
    let allOffers: Offer[] = [];

    const cpiParams = new URLSearchParams({
      ...commonParams,
      ctype: CTYPE_CPI.toString(),
    });

    const cpiResponse = await fetch(`${API_BASE_URL}?${cpiParams}`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });

    if (cpiResponse.ok) {
      const data: ApiOfferResponse = await cpiResponse.json();
      if (data.success && data.offers?.length) {
        allOffers = data.offers.map(mapApiOfferToOffer);
      }
    }

    // ── 2. High EPC PIN offers ───────────────────────
    const pinParams = new URLSearchParams({
      ...commonParams,
      ctype: CTYPE_PIN.toString(),
    });

    const pinResponse = await fetch(`${API_BASE_URL}?${pinParams}`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });

    if (pinResponse.ok) {
      const data: ApiOfferResponse = await pinResponse.json();
      if (data.success && data.offers?.length) {
        const goodPinOffers = data.offers
          .map(mapApiOfferToOffer)
          .filter((offer) => (offer.epc ?? 0) > minEpcForPin);

        allOffers = [...allOffers, ...goodPinOffers];
      }
    }

    // Final processing
    return allOffers
      .filter((offer) => (offer.epc ?? 0) >= MIN_EPC_OVERALL)
      .sort(compareOffers);

  } catch (error) {
    console.error("[fetchOffers] Failed:", error);
    return [];
  }
};

/**
 * Returns only the single best offer (usually CPI, sometimes very high EPC PIN)
 */
export const getTopOffer = async (): Promise<Offer | null> => {
  const offers = await fetchOffers();
  return offers.length > 0 ? offers[0] : null;
};

// For debugging / testing
export const debugGetOffers = async () => {
  const offers = await fetchOffers();
  console.table(
    offers.map(o => ({
      Type: o.type || "—",
      Title: o.title.substring(0, 40) + "...",
      EPC: o.epc?.toFixed(2),
      Payout: o.payout?.toFixed(2),
      URL: o.url.includes("areyourealhuman") ? "fallback" : "direct"
    }))
  );
  return offers;
};