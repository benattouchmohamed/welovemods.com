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

/* ---------- API types ---------- */
interface ApiOffer {
  offerid?: string;
  name?: string;
  name_short?: string;
  description?: string;
  adcopy?: string;
  picture?: string;
  payout?: string;
  country?: string;
  device?: string;
  link?: string;
  epc?: string;
  category?: string;
}

interface ApiOfferResponse {
  success?: boolean;
  error?: string | null;
  offers?: ApiOffer[];
}

/* ---------- Constants ---------- */
const API_BASE_URL = 'https://unlockcontent.net/api/v2';
const API_TOKEN = '32448|19Qy5BpANljlYzaK2NZLyV2WjChiAMUXR28Zd6lqb4757085';

/* ---------- Icon mapping ---------- */
const getOfferIcon = (category: string): string => {
  const map: Record<string, string> = {
    game: 'Gamepad2',
    survey: 'DollarSign',
    app: 'Smartphone',
    video: 'Monitor',
    social: 'Gift',
    default: 'Gift',
  };
  return map[category.toLowerCase()] ?? map.default;
};

/* ---------- Category inference (fallback) ---------- */
const inferCategory = (name = '', description = ''): string => {
  const txt = `${name} ${description}`.toLowerCase();
  if (txt.includes('game')) return 'game';
  if (txt.includes('survey')) return 'survey';
  if (txt.includes('app') || txt.includes('install')) return 'app';
  if (txt.includes('video')) return 'video';
  if (txt.includes('social')) return 'social';
  return 'default';
};

/* ---------- IP helper ---------- */
const getVisitorIP = async (): Promise<string> => {
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const d = await r.json();
    return d.ip ?? '127.0.0.1';
  } catch {
    return '127.0.0.1';
  }
};

/* ---------- Mapping ---------- */
const mapApiOfferToOffer = (api: ApiOffer, idx: number): Offer => {
  const category = api.category ?? inferCategory(api.name, api.description);
  return {
    id: api.offerid ?? `offer-${idx}`,
    title: api.name_short ?? api.name ?? 'Special Offer',
    description: api.adcopy ?? api.description ?? 'Complete this offer',
    difficulty: 'Easy',
    timeEstimate: '1 min', // all offers are short
    icon: getOfferIcon(category),
    url: api.link ?? 'https://areyourealhuman.com/cl/i/g6pqp2',
    image: api.picture,
    type: category,
    epc: api.epc ? parseFloat(api.epc) : undefined,
    payout: api.payout ? parseFloat(api.payout) : undefined,
  };
};

/* ---------- MAIN FETCH ---------- */
export async function fetchOffers(): Promise<Offer[]> {
  try {
    const visitorIP = await getVisitorIP();
    const userAgent = navigator.userAgent;

    const params = new URLSearchParams({
      ip: visitorIP,
      user_agent: userAgent,
      max: '2',  // fetch more offers
      min: '1',
      ctype: '7',
    });

    const response = await fetch(`${API_BASE_URL}?${params}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`API ${response.status}`);

    const data: ApiOfferResponse = await response.json();
    if (!data.success) throw new Error(data.error ?? 'API error');

    /* ---- 1. Map + keep numeric values for sorting ---- */
    const withMeta = (data.offers ?? []).map((api, i) => ({
      offer: mapApiOfferToOffer(api, i),
      payout: parseFloat(api.payout ?? '0'),
      epc: parseFloat(api.epc ?? '0'),
    }));

    /* ---- 2. Sort: payout DESC → epc DESC ---- */
    withMeta.sort((a, b) => {
      if (b.payout !== a.payout) return b.payout - a.payout;
      return b.epc - a.epc;
    });

    /* ---- ✅ Return all offers (no top4 filter) ---- */
    return withMeta.map(m => m.offer);

  } catch (err) {
    console.error('fetchOffers error →', err);
    return [];
  }
}

/* ---------- Helper: top-price offer (first item) ---------- */
export const getTopOffer = async (): Promise<Offer | null> => {
  const list = await fetchOffers();
  return list[0] ?? null;
};
