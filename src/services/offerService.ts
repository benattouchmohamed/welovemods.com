// export interface Offer {
//   id: string;
//   title: string;
//   description: string;
//   difficulty: 'Easy';
//   timeEstimate: string;
//   icon: string;
//   url: string;
//   image?: string;
//   type?: string;
//   epc?: number;
//   payout?: number;
// }

// interface ApiOffer {
//   offerid?: string;
//   name?: string;
//   name_short?: string;
//   description?: string;
//   adcopy?: string;
//   picture?: string;
//   payout?: string;
//   country?: string;
//   device?: string;
//   link?: string;
//   epc?: string;
//   category?: string;
// }

// interface ApiOfferResponse {
//   success?: boolean;
//   error?: string | null;
//   offers?: ApiOffer[];
// }

// const API_BASE_URL = 'https://unlockcontent.net/api/v2';
// const API_TOKEN = '32448|19Qy5BpANljlYzaK2NZLyV2WjChiAMUXR28Zd6lqb4757085';

// const getOfferIcon = (category: string): string => {
//   const iconMap: Record<string, string> = {
//     game: 'game',
//     survey: 'survey',
//     app: 'app',
//     video: 'video',
//     social: 'social',
//     default: 'gift',
//   };
//   return iconMap[category.toLowerCase()] || iconMap.default;
// };

// const inferCategory = (name: string, description: string): string => {
//   const lowerName = (name || '').toLowerCase();
//   const lowerDesc = (description || '').toLowerCase();
//   if (lowerName.includes('game') || lowerDesc.includes('game')) return 'game';
//   if (lowerName.includes('survey') || lowerDesc.includes('survey')) return 'survey';
//   if (lowerName.includes('app') || lowerDesc.includes('install')) return 'app';
//   if (lowerName.includes('video') || lowerDesc.includes('video')) return 'video';
//   if (lowerName.includes('social') || lowerDesc.includes('social')) return 'social';
//   return 'default';
// };

// const getVisitorIP = async (): Promise<string> => {
//   try {
//     const response = await fetch('https://api.ipify.org?format=json');
//     if (!response.ok) throw new Error('IP fetch failed');
//     const data = await response.json();
//     return data.ip || '127.0.0.1';
//   } catch {
//     return '127.0.0.1';
//   }
// };

// const mapApiOfferToOffer = (apiOffer: ApiOffer, index: number): Offer => {
//   const category = apiOffer.category ?? inferCategory(apiOffer.name ?? '', apiOffer.description ?? '');
//   return {
//     id: apiOffer.offerid ?? `offer-${index}`,
//     title: apiOffer.name_short ?? apiOffer.name ?? 'Special Offer',
//     description: apiOffer.adcopy ?? apiOffer.description ?? 'Complete this offer',
//     difficulty: 'Easy',
//     timeEstimate: apiOffer.device?.includes('Android') ? '5 min' : '3 min',
//     icon: getOfferIcon(category),
//     url: apiOffer.link ?? 'https://areyourealhuman.com/cl/i/g6pqp2',
//     image: apiOffer.picture,
//     type: category,
//     epc: apiOffer.epc ? parseFloat(apiOffer.epc) : 0,
//     // payout: apiOffer.payout ? parseFloat(apiOffer.payout) : 0,
//   };
// };

// export async function fetchOffers(): Promise<Offer[]> {
//   try {
//     const visitorIP = await getVisitorIP();
//     const userAgent = navigator.userAgent;

//     const params = new URLSearchParams({
//       ip: visitorIP,
//       user_agent: userAgent,
//       max: '6',
//       min: '3',
//       ctype: '7',
//     });

//     const response = await fetch(`${API_BASE_URL}?${params}`, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${API_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`API request failed with status ${response.status}`);
//     }

//     const apiData: ApiOfferResponse = await response.json();
//     if (!apiData.success) {
//       throw new Error(apiData.error || 'API returned unsuccessful response');
//     }

//     // Map API offers and store payout/epc for sorting
//     const offerWithMeta = (apiData.offers ?? []).map((offer, index) => ({
//       offer: mapApiOfferToOffer(offer, index),
//       payout: parseFloat(offer.payout || '0'),
//       epc: parseFloat(offer.epc || '0'),
//     }));

//     // Sort by payout desc, then EPC desc
//     offerWithMeta.sort((a, b) => {
//       if (a.payout !== b.payout) {
//         return b.payout - a.payout; // Sort by payout descending
//       }
//       return b.epc - a.epc; // If payout is equal, sort by EPC descending
//     });

//     return offerWithMeta.map(o => o.offer); // Return all offers for flexibility
//   } catch (error) {
//     console.error('Offer fetch failed:', error);
//     return [];
//   }
// }

// // Display the top payout offer with time estimate
// export async function displayTopPayoutOffer(): Promise<string> {
//   const offers = await fetchOffers();
//   if (offers.length === 0) {
//     return 'No offers available.';
//   }

//   // Get the top offer (already sorted by payout)
//   const topOffer = offers[0];

//   return `Top Payout Offer:
// Title: ${topOffer.title}
// Payout: $${topOffer.payout?.toFixed(2) || 'N/A'}
// EPC: $${topOffer.epc?.toFixed(4) || 'N/A'}
// Category: ${topOffer.type || 'Unknown'}
// Time Estimate: ${topOffer.timeEstimate}
// Description: ${topOffer.description}
// URL: ${topOffer.url}`;
// }
// src/services/offerService.ts
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
    timeEstimate: api.device?.includes('Android') ? '5 min' : '3 min',
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
      max: '6',
      min: '3',
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

    /* ---- 3. Return only the Offer objects ---- */
    return withMeta.map(m => m.offer);
  } catch (err) {
    console.error('fetchOffers error →', err);
    return []; // UI will show fallback link
  }
}

/* ---------- Helper: top-price offer (first item) ---------- */
export const getTopOffer = async (): Promise<Offer | null> => {
  const list = await fetchOffers();
  return list[0] ?? null;
};

/* ---------- Optional: pretty console log (dev only) ---------- */
export const logTopOffer = async () => {
  const top = await getTopOffer();
  if (!top) return console.log('No offers');
  console.log(`Top Offer:
  Title: ${top.title}
  Payout: $${top.payout?.toFixed(2) ?? 'N/A'}
  EPC: $${top.epc?.toFixed(4) ?? 'N/A'}
  Time: ${top.timeEstimate}
  URL: ${top.url}`);
};