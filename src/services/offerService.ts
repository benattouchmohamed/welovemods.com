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
  payout?: number; // تمثل CPA أيضًا
  cpa?: number; // اختياري إذا عندك قيمة CPA منفصلة
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
  cpa?: string; // اختياري
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

const fetchType = async (ctype: number): Promise<Offer[]> => {
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
      ctype: String(ctype),
      min: "4",
      max: "4",
    });

    const r = await fetch(`${API_URL}?${params}`, { headers });
    if (!r.ok) return [];

    const j: ApiOfferResponse = await r.json();
    return (j.offers ?? []).map(mapOffer).sort(sortOffers);
  } catch {
    return [];
  }
};

// ====================================================
// MAIN FUNCTION – عرض بالضبط 2 عروض لكل نوع + حذف التكرار
// ====================================================
export const fetchOffers = async (): Promise<Offer[]> => {
  const CPI = await fetchType(1);
  const PIN = await fetchType(4);
  const VID = await fetchType(8);

  const result: Offer[] = [];

  // CPI ≥ 0.2$
  const goodCPI = CPI.filter(o => (o.payout ?? 0) >= 0.2);
  result.push(...goodCPI);

  // إذا CPI أقل من 2 → نكمل من PIN و VID
  const needed = 2 - result.length;
  if (needed > 0) {
    const extra: Offer[] = [...PIN, ...VID];
    for (const offer of extra) {
      if (result.length >= 2) break;
      // إضافة فقط إذا لم يكن موجود مسبقًا (حذف التكرار)
      if (!result.find(o => o.id === offer.id)) {
        result.push(offer);
      }
    }
  }

  // ترتيب النتيجة حسب EPC → Payout → CPA
  return result.sort(sortOffers).slice(0, 2);
};

// اختياري: للحصول على أفضل عرض فقط
export const getTopOffer = async () => {
  const offers = await fetchOffers();
  return offers[0] ?? null;
};
