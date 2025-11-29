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
  category?: string; // "Disabled" sometimes used
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
    const r = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
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

const sortOffers = (a: Offer, b: Offer): number => {
  const epcA = a.epc ?? -Infinity;
  const epcB = b.epc ?? -Infinity;
  if (epcB !== epcA) return epcB - epcA;

  const payoutA = a.payout ?? -Infinity;
  const payoutB = b.payout ?? -Infinity;
  if (payoutB !== payoutA) return payoutB - payoutA;

  return 0;
};

// MAIN
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
        let mapped = data.success ? (data.offers ?? []).map(mapApiOfferToOffer) : [];

        // 🔥 FILTER 1: Remove disabled / invalid offers
        mapped = mapped.filter(
          (o) =>
            o &&
            o.url &&
            o.title &&
            o.type?.toLowerCase() !== "disabled" && // Hidden flag
            (o.payout ?? 0) > 0                       // Remove payout=0 garbage
        );

        // 🔥 FILTER 2: CPI must be payout ≥ $0.30
        if (ctype === CTYPE.CPI) {
          mapped = mapped.filter((o) => (o.payout ?? 0) >= 0.3);
          if (mapped.length === 0) {
            console.warn("No CPI ≥ $0.30 → skipping CPI");
            continue;
          }
        }

        // Sort
        mapped.sort(sortOffers);

        for (const o of mapped) {
          if (allOffers.length >= 2) break;
          allOffers.push(o);
        }
      } catch (err) {
        console.warn(`Fetch error for ${type}:`, err);
      }
    }

    // Fallback
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
          let mapped = ((await resp.json()) as ApiOfferResponse).offers?.map(mapApiOfferToOffer) ?? [];

          mapped = mapped.filter(
            (o) =>
              o &&
              o.url &&
              o.title &&
              o.type?.toLowerCase() !== "disabled" &&
              (o.payout ?? 0) > 0
          );

          mapped.sort(sortOffers);

          for (const o of mapped) {
            if (allOffers.length >= 2) break;
            allOffers.push(o);
          }
        }
      } catch (err) {
        console.warn("Fallback error:", err);
      }
    }

    return allOffers.slice(0, 2);
  } catch (err) {
    console.error("fetchOffers error:", err);
    return [];
  }
};

export const getTopOffer = async (): Promise<Offer | null> => {
  try {
    const offers = await fetchOffers();
    return offers[0] ?? null;
  } catch {
    return null;
  }
};
