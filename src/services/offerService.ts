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
const API_TOKEN =
  "32448|19Qy5BpANljlYzaK2NZLyV2WjChiAMUXR28Zd6lqb4757085";
const FALLBACK_URL = "https://areyourealhuman.com/cl/i/g6pqp2";
const CTYPE = { CPI: 1, CPA: 2, PIN: 4, VID: 8 } as const;

// Priority order: CPI → VID → PIN → CPA
const PRIORITY_ORDER = [
  { type: "CPI", ctype: CTYPE.CPI },
  { type: "VID", ctype: CTYPE.VID },
  { type: "PIN", ctype: CTYPE.PIN },
  { type: "CPA", ctype: CTYPE.CPA },
] as const;

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
    console.warn("IP fetch failed → using fallback");
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
    description: api.adcopy ?? api.description ?? "Complete this offer",
    difficulty: "Easy",
    timeEstimate: "1 min",
    icon: "Gift",
    url,
    image: api.picture,
    type: api.category,
    epc: parseFloatOrNull(api.epc),
    payout: parseFloatOrNull(api.payout),
  };
};

// ──────────────────────────────
// SORT: Highest EPC → Highest payout → fallback index
// ──────────────────────────────
const sortOffers = (a: Offer, b: Offer, aIdx: number, bIdx: number): number => {
  const epcA = a.epc ?? -Infinity;
  const epcB = b.epc ?? -Infinity;

  // 1) Higher EPC first
  if (epcB !== epcA) return epcB - epcA;

  const payoutA = a.payout ?? -Infinity;
  const payoutB = b.payout ?? -Infinity;

  // 2) If EPC same → highest payout first
  if (payoutB !== payoutA) return payoutB - payoutA;

  // 3) Fallback: original order
  return aIdx - bIdx;
};

// ────── Main Function ──────
export const fetchOffers = async (): Promise<Offer[]> => {
  try {
    const visitorIP = await getVisitorIP();
    const userAgent = navigator.userAgent;

    const headers = {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    };

    // Polyfill for AbortSignal.timeout
    const timeoutSignal =
      typeof AbortSignal.timeout === "function"
        ? AbortSignal.timeout(10000)
        : (() => {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 10000);
            return controller.signal;
          })();

    const allOffers: Offer[] = [];

    // Step 1: Sequential priority requests (CPI → VID → PIN → CPA)
    for (const { type, ctype } of PRIORITY_ORDER) {
      if (allOffers.length >= 2) break; // Stop early if we already have 2

      const params = new URLSearchParams({
        ip: visitorIP,
        user_agent: userAgent,
        ctype: ctype.toString(),
     min: "2",
        max: "3",
      });

      try {
        const resp = await fetch(`${API_BASE_URL}?${params}`, {
          method: "GET",
          headers,
          signal: timeoutSignal,
        });

        if (resp.ok) {
          const data: ApiOfferResponse = await resp.json();
          const rawOffers = data.success ? data.offers ?? [] : [];
          const mapped = rawOffers.slice(0, 3).map(mapApiOfferToOffer);
          allOffers.push(...mapped);
        }
      } catch (err) {
        console.warn(`Failed to fetch ${type} offers:`, err);
      }
    }

    // Step 2: Sort all collected offers by EPC → payout
    return allOffers
      .map((o, i) => ({ offer: o, idx: i }))
      .sort((a, b) => sortOffers(a.offer, b.offer, a.idx, b.idx))
      .slice(0, 3) // final cap: 3 offers
      .map((x) => x.offer);
  } catch (err) {
    console.error("fetchOffers error →", err);
    return [];
  }
};

// ────── Convenience ──────
export const getTopOffer = async (): Promise<Offer | null> => {
  const offers = await fetchOffers();
  return offers[0] ?? null; // BEST EPC → BEST payout
};
