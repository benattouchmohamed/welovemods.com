// offers.ts
// Smart dual-request + EPC-sorted offers
// → CPI: up to 2 offers (highest EPC first)
// → Fallback: up to 3 non-CPI offers (CPA + PIN + VID), highest EPC first

export interface Offer {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy';
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
const API_BASE_URL = 'https://unlockcontent.net/api/v2';
const API_TOKEN = '32448|19Qy5BpANljlYzaK2NZLyV2WjChiAMUXR28Zd6lqb4757085';
const FALLBACK_URL = 'https://areyourealhuman.com/cl/i/g6pqp2';

const CTYPE = { CPI: 1, CPA: 2, PIN: 4, VID: 8 } as const;

// ────── Helpers ──────
const getVisitorIP = async (): Promise<string> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const r = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeoutId);
    const d = await r.json();
    return d.ip ?? '127.0.0.1';
  } catch {
    console.warn('IP fetch failed → using fallback');
    return '127.0.0.1';
  }
};

const parseFloatOrNull = (val?: string): number | null =>
  val && !isNaN(parseFloat(val)) ? parseFloat(val) : null;

const mapApiOfferToOffer = (api: ApiOffer, idx: number): Offer => {
  const url = api.link && /^https?:\/\//i.test(api.link) ? api.link : FALLBACK_URL;
  return {
    id: api.offerid ?? `offer-${idx}`,
    title: api.name_short ?? api.name ?? 'Special Offer',
    description: api.adcopy ?? api.description ?? 'Complete this offer',
    difficulty: 'Easy',
    timeEstimate: '1 min',
    icon: 'Gift',
    url,
    image: api.picture,
    type: api.category,
    epc: parseFloatOrNull(api.epc),
    payout: parseFloatOrNull(api.payout),
  };
};

// Sort by EPC descending (highest first), fallback to original index
const sortByEpc = (a: Offer, b: Offer, aIdx: number, bIdx: number): number => {
  const epcA = a.epc ?? -Infinity;
  const epcB = b.epc ?? -Infinity;
  return epcB - epcA || aIdx - bIdx;
};

// ────── Main Function ──────
export const fetchOffers = async (): Promise<Offer[]> => {
  try {
    const visitorIP = await getVisitorIP();
    const userAgent = navigator.userAgent;

    const headers = {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    };

    // Polyfill for older browsers (AbortSignal.timeout not in all envs)
    const timeoutSignal = typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(10000)
      : (() => {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 10000);
          return controller.signal;
        })();

    // ── Step 1: Try CPI (up to 2 offers) ──
    const cpiParams = new URLSearchParams({
      ip: visitorIP,
      user_agent: userAgent,
      ctype: CTYPE.CPI.toString(),
      max: '2',
      min: '1',
    });

    const cpiResp = await fetch(`${API_BASE_URL}?${cpiParams}`, {
      method: 'GET',
      headers,
      signal: timeoutSignal,
    });

    if (cpiResp.ok) {
      const data: ApiOfferResponse = await cpiResp.json();
      const cpiRaw = data.success ? (data.offers ?? []) : [];
      if (cpiRaw.length > 0) {
        const offers = cpiRaw.slice(0, 2).map(mapApiOfferToOffer);
        return offers
          .map((o, i) => ({ offer: o, idx: i }))
          .sort((a, b) => sortByEpc(a.offer, b.offer, a.idx, b.idx))
          .map(x => x.offer);
      }
    }

    // ── Step 2: Fallback → non-CPI (CPA + PIN + VID) → up to 3 offers ──
    const otherParams = new URLSearchParams({
      ip: visitorIP,
      user_agent: userAgent,
      ctype: (CTYPE.CPA + CTYPE.PIN + CTYPE.VID).toString(), // 14
      max: '2',
      min: '1',
    });

    const otherResp = await fetch(`${API_BASE_URL}?${otherParams}`, {
      method: 'GET',
      headers,
      signal: timeoutSignal,
    });

    if (otherResp.ok) {
      const data: ApiOfferResponse = await otherResp.json();
      const otherRaw = data.success ? (data.offers ?? []) : [];

      // FIXED: Keep up to 3 offers (not 2)
      const offers = otherRaw.slice(0, 3).map(mapApiOfferToOffer);

      return offers
        .map((o, i) => ({ offer: o, idx: i }))
        .sort((a, b) => sortByEpc(a.offer, b.offer, a.idx, b.idx))
        .map(x => x.offer);
    }

    return [];
  } catch (err) {
    console.error('fetchOffers error →', err);
    return [];
  }
};

// ────── Convenience ──────
export const getTopOffer = async (): Promise<Offer | null> => {
  const offers = await fetchOffers();
  return offers[0] ?? null; // Guaranteed highest EPC
};