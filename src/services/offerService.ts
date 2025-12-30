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
  category?: string; // CPI / CPA / PIN / VID
  cpa?: string;
}

interface ApiOfferResponse {
  success?: boolean;
  error?: string | null;
  offers?: ApiOffer[];
}

const API_URL = "https://unlockcontent.net/api/v2";
const TOKEN =
  "32448|19Qy5BpANljlYzaK2NZLyV2WjChiAMUXR28Zd6lqb4757085";
const FALLBACK = "https://areyourealhuman.com/cl/i/g6pqp2";

/* ------------------ helpers ------------------ */

const getIP = async (): Promise<string> => {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const j = await r.json();
    return j.ip ?? "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
};

const parseNumber = (v?: string): number | undefined =>
  v && !isNaN(Number(v)) ? Number(v) : undefined;

/* ------------------ mappers ------------------ */

const mapOffer = (o: ApiOffer, i: number): Offer => ({
  id: o.offerid ?? `offer-${i}`,
  title: o.name_short ?? o.name ?? "Offer",
  description: o.adcopy ?? o.description ?? "",
  difficulty: "Easy",
  timeEstimate: "1 min",
  icon: "Gift",
  url: o.link?.startsWith("http") ? o.link : FALLBACK,
  image: o.picture,
  type: o.category,
  epc: parseNumber(o.epc),
  payout: parseNumber(o.payout),
  cpa: parseNumber(o.cpa) ?? parseNumber(o.payout),
});

/* ------------------ API ------------------ */

const fetchAllOffers = async (): Promise<Offer[]> => {
  try {
    const ip = await getIP();
    const ua = navigator.userAgent;

    const params = new URLSearchParams({
      ip,
      user_agent: ua,
      ctype: "15", // CPI + CPA + PIN + VID
      min: "3",
    });

    const r = await fetch(`${API_URL}?${params}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!r.ok) return [];

    const j: ApiOfferResponse = await r.json();
    return (j.offers ?? []).map(mapOffer);
  } catch {
    return [];
  }
};

/* ------------------ PUBLIC ------------------ */

export const fetchOffers = async (): Promise<Offer[]> => {
  const all = await fetchAllOffers();

  // Remove duplicates by ID
  const unique = Array.from(
    new Map(all.map(o => [o.id, o])).values()
  );

  const byEpcDesc = (a: Offer, b: Offer) =>
    (b.epc ?? 0) - (a.epc ?? 0);

  // Sort all offers by EPC
  const sortedAll = [...unique].sort(byEpcDesc);

  const cpi = sortedAll.filter(o => o.type === "CPI");
  const pin = sortedAll.filter(o => o.type === "PIN");
  const others = sortedAll.filter(
    o => o.type !== "CPI" && o.type !== "PIN"
  );

  let result: Offer[] = [];

  // Priority logic
  if (cpi.length > 0) {
    result.push(...cpi.slice(0, 2)); // up to 2 CPI
  } else if (pin.length > 0) {
    result.push(...pin.slice(0, 2)); // up to 2 PIN
  }

  // Fill remaining slots by best EPC (excluding duplicates)
  const usedIds = new Set(result.map(o => o.id));
  const remaining = sortedAll.filter(o => !usedIds.has(o.id));

  result.push(...remaining.slice(0, 4 - result.length));

  // Guarantee min 3, max 4
  return result.slice(0, Math.min(4, Math.max(3, result.length)));
};

/* ------------------ TOP OFFER ------------------ */

export const getTopOffer = async (): Promise<Offer | null> => {
  const offers = await fetchOffers();
  return offers[0] ?? null;
};
