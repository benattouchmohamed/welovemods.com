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

const parse = (v?: string): number | undefined =>
  v && !isNaN(Number(v)) ? Number(v) : undefined;

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
  epc: parse(o.epc),
  payout: parse(o.payout),
  cpa: parse(o.cpa) ?? parse(o.payout),
});

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

export const fetchOffers = async (): Promise<Offer[]> => {
  const all = await fetchAllOffers();

  // Remove duplicates by id
  const unique = Array.from(
    new Map(all.map(o => [o.id, o])).values()
  );

  // Sort by EPC descending (highest first), fallback to 0
  const byEpcDesc = (a: Offer, b: Offer) =>
    (b.epc ?? 0) - (a.epc ?? 0);

  // Group by type
  const cpi = unique.filter(o => o.type === "CPI");
  const pin = unique.filter(o => o.type === "PIN");
  const others = unique.filter(o => o.type !== "CPI" && o.type !== "PIN");

  // Sort each group by top EPC
  cpi.sort(byEpcDesc);
  pin.sort(byEpcDesc);
  others.sort(byEpcDesc);

  let combined: Offer[] = [];

  if (cpi.length > 0) {
    // CPI exists: CPI first (top 2), then the rest of non-CPI (top 1 overall from non-CPI)
    const topNonCpi = [...pin, ...others].sort(byEpcDesc)[0]; // top 1 non-CPI
    combined = [
      ...cpi.slice(0, 2),               // max 2 CPI
      ...(topNonCpi ? [topNonCpi] : []), // 1 non-CPI
    ];
  } else {
    // No CPI: PIN first (top 2), then others (top 1)
    combined = [
      ...pin.slice(0, 2),               // max 2 PIN
      ...others.slice(0, 2),            // max 1 other
    ];
  }

  // Final cap at 5 (safety), though with limits above it's max 3
  return combined.slice(0, 5);
};

// Get ONLY the top offer (highest ranked one after new logic)
export const getTopOffer = async (): Promise<Offer | null> => {
  const offers = await fetchOffers();
  return offers[0] ?? null;
};