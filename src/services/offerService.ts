// ==========================================================
//  Offer Wall
// ==========================================================

export interface Offer {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  type: string;
  epc: number;
  payout: number;
}

// ──────────────────────────────────────────────
// IP LOOKUP (Multi-Service Fallback)
// ──────────────────────────────────────────────

const getVisitorIP = async (): Promise<string> => {
  const services = [
    { url: "https://1.1.1.1/cdn-cgi/trace",      parse: (d: string) => d.match(/ip=(.*)/)?.[1] },
    { url: "https://checkip.amazonaws.com",       parse: (d: string) => d.trim() },
    { url: "https://api.ipify.org",               parse: (d: string) => d.trim() },
    { url: "https://ifconfig.me/ip",              parse: (d: string) => d.trim() },
    { url: "https://api64.ipify.org?format=json", parse: (d: string) => JSON.parse(d).ip },
    { url: "https://ifconfig.co/json",            parse: (d: string) => JSON.parse(d).ip },
  ];

  for (const service of services) {
    try {
      const res  = await fetch(service.url, { signal: AbortSignal.timeout(2000) });
      const data = service.url.includes("json") ? await res.json() : await res.text();
      const ip   = service.parse(data as string);
      if (ip) return ip;
    } catch {
      continue;
    }
  }
  return "1.1.1.1";
};

// ──────────────────────────────────────────────
// CORE FETCH FUNCTION
// ──────────────────────────────────────────────

const fetchFromAPI = async (ip: string, min: number, max: number): Promise<any[]> => {
  const params = new URLSearchParams({
    ip,
    user_agent: navigator.userAgent,
    min: String(min),
    max: String(max),
  });

  try {
    const res  = await fetch(`https://unlockcontent.net/api/v2?${params}`, {
      headers: { Authorization: "Bearer 41086|kN3rPO0stcLIm19BJiqpT2LQR5eDR8LDwsI4Fopi0ecc69b7" },
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    return data.success && Array.isArray(data.offers) ? data.offers : [];
  } catch (err) {
    console.error("API Fetch Failed", err);
    return [];
  }
};

// ──────────────────────────────────────────────
// MAIN EXPORT
// ──────────────────────────────────────────────

export const fetchOffers = async (): Promise<Offer[]> => {
  try {
    const ip        = await getVisitorIP();
    const rawOffers = await fetchFromAPI(ip, 1, 1);

    const mapped: Offer[] = rawOffers.map((o: any, i: number) => ({
      id:          o.offerid    ?? `off-${i}`,
      title:       o.name_short ?? o.name,
      description: o.adcopy     ?? o.description,
      url:         o.link,
      image:       o.picture,
      type:        (o.category  || "").toUpperCase(),
      epc:         parseFloat(o.epc)    || 0,
      payout:      parseFloat(o.payout) || 0,
    }));

    return mapped;

  } catch (err) {
    console.error("❌ Offer Fetch Error", err);
    return [];
  }
};