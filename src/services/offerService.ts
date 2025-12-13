// src/services/offerService.ts

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

const getIP = async (): Promise<string> => {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const j = await r.json();
    return j.ip ?? "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
};

const parse = (v?: string): number | null =>
  v && !isNaN(parseFloat(v)) ? parseFloat(v) : null;

const mapOffer = (o: ApiOffer, i: number): Offer => ({
  id: o.offerid ?? `id-${i}`,
  title: o.name_short ?? o.name ?? "Offer",
  description: o.adcopy ?? o.description ?? "",
  difficulty: "Easy",
  timeEstimate: "1 min",
  icon: "Gift",
  url: o.link && o.link.startsWith("http") ? o.link : FALLBACK,
  image: o.picture,
  type: o.category,
  epc: parse(o.epc),
  payout: parse(o.payout),
  cpa: parse(o.cpa) ?? parse(o.payout),
});

const sortOffers = (a: Offer, b: Offer) =>
  (b.epc ?? 0) - (a.epc ?? 0) ||
  (b.payout ?? 0) - (a.payout ?? 0) ||
  (b.cpa ?? 0) - (a.cpa ?? 0);

const fetchAllOffers = async (): Promise<Offer[]> => {
  try {
    const ip = await getIP();
    const ua = navigator.userAgent;

    const headers = {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    };

    const params = new URLSearchParams({
      ip,
      user_agent: ua,
      ctype: "15", // 1 (CPI) + 4 (PIN) + 8 (VID) = all types
    });

    const r = await fetch(`${API_URL}?${params}`, { headers });
    if (!r.ok) return [];

    const j: ApiOfferResponse = await r.json();
    return (j.offers ?? []).map(mapOffer);
  } catch {
    return [];
  }
};

export const fetchOffers = async (): Promise<Offer[]> => {
  const all = await fetchAllOffers();

  // Remove duplicates by ID
  const unique: Offer[] = [];
  const seen = new Set<string>();
  for (const offer of all) {
    if (!seen.has(offer.id)) {
      seen.add(offer.id);
      unique.push(offer);
    }
  }

  // Sort by EPC → payout → CPA
  unique.sort(sortOffers);

  // Return up to 3 offers
  return unique.slice(0, 3);
};

// Get ONLY the top offer
export const getTopOffer = async () => {
  const offers = await fetchOffers();
  return offers[0] ?? null;
};