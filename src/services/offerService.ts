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
});

// ترتيب من الأعلى للأقل (EPC → Payout)
const sortOffers = (a: Offer, b: Offer) =>
  (b.epc ?? 0) - (a.epc ?? 0) || (b.payout ?? 0) - (a.payout ?? 0);

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
    return (j.offers ?? []).map(mapOffer);
  } catch {
    return [];
  }
};

// ====================================================
// MAIN FUNCTION – يعرض كل عروض CPI فوق 0.2$ إذا وجدت
// ====================================================
export const fetchOffers = async (): Promise<Offer[]> => {
  const CPI = (await fetchType(1)).sort(sortOffers);
  const PIN = (await fetchType(4)).sort(sortOffers);
  const VID = (await fetchType(8)).sort(sortOffers);

  // فلترة عروض CPI اللي payout أكبر من أو يساوي 0.2 دولار
  const goodCPI = CPI.filter(offer => (offer.payout ?? 0) >= 0.2);

  // لو فيه عرض CPI واحد على الأقل فوق 0.2$ → نعرض كل الـ goodCPI فقط
  if (goodCPI.length > 0) {
    return goodCPI; // ممكن 1 أو 2 أو 3 أو 4 (كلهم CPI بس قويين)
  }

  // لو مفيش ولا عرض CPI فوق 0.2$ → نرجع للطريقة القديمة (أي عرض متاح)
  const selected = [
    ...CPI.slice(0, 2),
    ...PIN.slice(0, 1),
    ...VID.slice(0, 1),
  ];

  // حذف التكرار
  const unique = Array.from(
    new Map(selected.map(o => [o.id, o])).values()
  );

  return unique;
};

// اختياري: للحصول على أفضل عرض فقط
export const getTopOffer = async () => {
  const offers = await fetchOffers();
  return offers[0] ?? null;
};