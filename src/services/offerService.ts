// export interface Offer {
//   id: string;
//   title: string;
//   description: string;
//   difficulty: "Easy";
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
//   link?: string;
//   epc?: string;
//   category?: string;
// }

// interface ApiOfferResponse {
//   success?: boolean;
//   error?: string | null;
//   offers?: ApiOffer[];
// }

// // ────── Config ──────
// const API_BASE_URL = "https://unlockcontent.net/api/v2";
// const API_TOKEN =
//   "32448|19Qy5BpANljlYzaK2NZLyV2WjChiAMUXR28Zd6lqb4757085";
// const FALLBACK_URL = "https://areyourealhuman.com/cl/i/g6pqp2";

// const CTYPE = { CPI: 1, CPA: 2, PIN: 4, VID: 8 } as const;

// // Priority order: CPI → VID → PIN → CPA
// const PRIORITY_ORDER = [
//   { type: "CPI", ctype: CTYPE.CPI },
//   { type: "VID", ctype: CTYPE.VID },
//   { type: "PIN", ctype: CTYPE.PIN },
//   { type: "CPA", ctype: CTYPE.CPA },
// ] as const;

// // ────── Helpers ──────
// const getVisitorIP = async (): Promise<string> => {
//   try {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 5000);
//     const r = await fetch("https://api.ipify.org?format=json", {
//       signal: controller.signal,
//     });
//     clearTimeout(timeoutId);
//     const d = await r.json();
//     return d.ip ?? "127.0.0.1";
//   } catch {
//     console.warn("IP fetch failed → using fallback");
//     return "127.0.0.1";
//   }
// };

// const parseFloatOrNull = (val?: string): number | null =>
//   val && !isNaN(parseFloat(val)) ? parseFloat(val) : null;

// const mapApiOfferToOffer = (api: ApiOffer, idx: number): Offer => {
//   const url = api.link && /^https?:\/\//i.test(api.link) ? api.link : FALLBACK_URL;

//   return {
//     id: api.offerid ?? `offer-${idx}`,
//     title: api.name_short ?? api.name ?? "Special Offer",
//     description: api.adcopy ?? api.description ?? "Complete this offer",
//     difficulty: "Easy",
//     timeEstimate: "1 min",
//     icon: "Gift",
//     url,
//     image: api.picture,
//     type: api.category,
//     epc: parseFloatOrNull(api.epc),
//     payout: parseFloatOrNull(api.payout),
//   };
// };

// // ──────────────────────────────
// // SORT: Highest EPC → Highest payout → fallback index
// // ──────────────────────────────
// const sortOffers = (a: Offer, b: Offer, aIdx: number, bIdx: number): number => {
//   const epcA = a.epc ?? -Infinity;
//   const epcB = b.epc ?? -Infinity;

//   if (epcB !== epcA) return epcB - epcA;

//   const payoutA = a.payout ?? -Infinity;
//   const payoutB = b.payout ?? -Infinity;

//   if (payoutB !== payoutA) return payoutB - payoutA;

//   return aIdx - bIdx;
// };

// // ────── Main Function ──────
// export const fetchOffers = async (): Promise<Offer[]> => {
//   try {
//     const visitorIP = await getVisitorIP();
//     const userAgent = navigator.userAgent;

//     const headers = {
//       Authorization: `Bearer ${API_TOKEN}`,
//       "Content-Type": "application/json",
//     };

//     const timeoutSignal =
//       typeof AbortSignal.timeout === "function"
//         ? AbortSignal.timeout(10000)
//         : (() => {
//             const controller = new AbortController();
//             setTimeout(() => controller.abort(), 10000);
//             return controller.signal;
//           })();

//     const allOffers: Offer[] = [];

//     for (const { type, ctype } of PRIORITY_ORDER) {
//       if (allOffers.length >= 2) break;

//       const params = new URLSearchParams({
//         ip: visitorIP,
//         user_agent: userAgent,
//         ctype: ctype.toString(),
//         min: "2",
//         max: "2",
//       });

//       try {
//         const resp = await fetch(`${API_BASE_URL}?${params}`, {
//           method: "GET",
//           headers,
//           signal: timeoutSignal,
//         });

//         if (resp.ok) {
//           const data: ApiOfferResponse = await resp.json();
//           const rawOffers = data.success ? data.offers ?? [] : [];
//           const mapped = rawOffers.slice(0, 2).map(mapApiOfferToOffer);
//           allOffers.push(...mapped);
//         }
//       } catch (err) {
//         console.warn(`Failed to fetch ${type} offers:`, err);
//       }
//     }

//     return allOffers
//       .map((o, i) => ({ offer: o, idx: i }))
//       .sort((a, b) => sortOffers(a.offer, b.offer, a.idx, b.idx))
//       .slice(0, 2)
//       .map((x) => x.offer);
//   } catch (err) {
//     console.error("fetchOffers error →", err);
//     return [];
//   }
// };

// // ────── Convenience ──────
// export const getTopOffer = async (): Promise<Offer | null> => {
//   try {
//     const offers = await fetchOffers();

//     if (!offers || offers.length === 0) return null;

//     return offers[0];
//   } catch (err) {
//     console.error("getTopOffer error →", err);
//     return null;
//   }
// };
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

// Config
const API_BASE_URL = "https://unlockcontent.net/api/v2";
const API_TOKEN = "32448|19Qy5BpANljlYzaK2NZLyV2WjChiAMUXR28Zd6lqb4757085";
const FALLBACK_URL = "https://areyourealhuman.com/cl/i/g6pqp2";

const CTYPE = { CPI: 1, CPA: 2, PIN: 4, VID: 8 } as const;

// Priority order
const PRIORITY_ORDER = [
  { type: "CPI", ctype: CTYPE.CPI },
  { type: "VID", ctype: CTYPE.VID },
  { type: "PIN", ctype: CTYPE.PIN },
  { type: "CPA", ctype: CTYPE.CPA },
] as const;

// Helpers
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
  const url =
    api.link && /^https?:\/\//i.test(api.link) ? api.link : FALLBACK_URL;

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

// Sort EPC → payout → fallback index
const sortOffers = (a: Offer, b: Offer, aIdx: number, bIdx: number): number => {
  const epcA = a.epc ?? -Infinity;
  const epcB = b.epc ?? -Infinity;
  if (epcB !== epcA) return epcB - epcA;

  const payoutA = a.payout ?? -Infinity;
  const payoutB = b.payout ?? -Infinity;
  if (payoutB !== payoutA) return payoutB - payoutA;

  return aIdx - bIdx;
};

// MAIN FUNCTION
export const fetchOffers = async (): Promise<Offer[]> => {
  try {
    const visitorIP = await getVisitorIP();
    const userAgent = navigator.userAgent;

    const headers = {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    };

    const timeoutSignal =
      typeof AbortSignal.timeout === "function"
        ? AbortSignal.timeout(10000)
        : (() => {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 10000);
            return controller.signal;
          })();

    const allOffers: Offer[] = [];

    // ──────────────────────────────
    // PRIORITY LOOP
    // ──────────────────────────────
    for (const { type, ctype } of PRIORITY_ORDER) {
      if (allOffers.length >= 2) break;

      const params = new URLSearchParams({
        ip: visitorIP,
        user_agent: userAgent,
        ctype: ctype.toString(),
        min: "6",
        max: "6",
      });

      try {
        const resp = await fetch(`${API_BASE_URL}?${params}`, {
          method: "GET",
          headers,
          signal: timeoutSignal,
        });

        if (!resp.ok) continue;

        const data: ApiOfferResponse = await resp.json();
        const rawOffers = data.success ? data.offers ?? [] : [];
        let mapped = rawOffers.map(mapApiOfferToOffer);

        // ──────────────────────────────
        // 1️⃣ CPI logic
        // ──────────────────────────────
        if (ctype === CTYPE.CPI) {
          const weakCPI =
            mapped.length === 0 ||
            mapped.every((o) => (o.payout ?? 0) < 0.3);

          if (weakCPI) {
            console.warn("CPI missing or payout < $0.30 → skipping CPI");
            continue;
          }

          mapped = mapped.slice(0, 2);
        } else {
          // ──────────────────────────────
          // 2️⃣ VID → PIN → CPA:
          // Sort by EPC/Payout and take the best
          // ──────────────────────────────
          mapped.sort((a, b) => sortOffers(a, b, 0, 1));
          mapped = mapped.slice(0, 2);
        }

        allOffers.push(...mapped);
      } catch (err) {
        console.warn(`Error fetching ${type}:`, err);
      }
    }

    // ──────────────────────────────
    // 3️⃣ FINAL FALLBACK
    // ──────────────────────────────
    if (allOffers.length < 2) {
      try {
        const params = new URLSearchParams({
          ip: visitorIP,
          user_agent: userAgent,
          min: "8",
          max: "8",
        });

        const resp = await fetch(`${API_BASE_URL}?${params}`, {
          method: "GET",
          headers,
          signal: timeoutSignal,
        });

        if (resp.ok) {
          const data: ApiOfferResponse = await resp.json();
          const rawOffers = data.success ? data.offers ?? [] : [];
          const mapped = rawOffers.map(mapApiOfferToOffer);

          mapped.sort((a, b) => sortOffers(a, b, 0, 1));

          for (const o of mapped) {
            if (allOffers.length >= 2) break;
            allOffers.push(o);
          }
        }
      } catch (err) {
        console.warn("Fallback fetch failed:", err);
      }
    }

    // Final 2 best offers
    return allOffers
      .map((o, i) => ({ offer: o, idx: i }))
      .sort((a, b) => sortOffers(a.offer, b.offer, a.idx, b.idx))
      .slice(0, 2)
      .map((x) => x.offer);
  } catch (err) {
    console.error("fetchOffers error:", err);
    return [];
  }
};

// Convenience
export const getTopOffer = async (): Promise<Offer | null> => {
  try {
    const offers = await fetchOffers();
    return offers[0] ?? null;
  } catch {
    return null;
  }
};
