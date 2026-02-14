// ==========================================================
//  Offer Wall - TRUE CPI ONLY MODE (API LEVEL)
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
    { url: "https://1.1.1.1/cdn-cgi/trace", parse: (d: string) => d.match(/ip=(.*)/)?.[1] },
    { url: "https://checkip.amazonaws.com", parse: (d: string) => d.trim() },
    { url: "https://ifconfig.me/ip", parse: (d: string) => d.trim() },
    { url: "https://api.ipify.org", parse: (d: string) => d.trim() },
    { url: "https://api64.ipify.org?format=json", parse: (d: string) => JSON.parse(d).ip },
    { url: "https://ifconfig.co/json", parse: (d: string) => JSON.parse(d).ip },
    { url: "https://api.seeip.org/jsonip", parse: (d: string) => JSON.parse(d).ip },
    { url: "https://ipapi.co/json/", parse: (d: string) => JSON.parse(d).ip },
    { url: "https://www.cloudflare.com/cdn-cgi/trace", parse: (d: string) => d.match(/ip=(.*)/)?.[1] }
  ];

  for (const service of services) {
    try {
      const res = await fetch(service.url, { signal: AbortSignal.timeout(2000) });
      const data = service.url.includes("json") ? await res.json() : await res.text();
      const ip = service.parse(data);
      if (ip) return ip;
    } catch {
      continue;
    }
  }
  return "1.1.1.1"; // Ultimate fallback
};

// ──────────────────────────────────────────────
// CORE FETCH FUNCTION
// ──────────────────────────────────────────────

const fetchFromAPI = async (
  ip: string,
  min: number,
  max: number
): Promise<any[]> => {
  const params = new URLSearchParams({
    ip,
    user_agent: navigator.userAgent,
    min: String(min),
    max: String(max)
  });

  try {
    const res = await fetch(
      `https://unlockcontent.net/api/v2?${params}`,
      {
        headers: {
          Authorization: "Bearer 41086|kN3rPO0stcLIm19BJiqpT2LQR5eDR8LDwsI4Fopi0ecc69b7"
        },
        signal: AbortSignal.timeout(8000)
      }
    );

    const data = await res.json();
    return (data.success && Array.isArray(data.offers)) ? data.offers : [];
  } catch (err) {
    console.error("API Fetch Failed", err);
    return [];
  }
};

// ──────────────────────────────────────────────
// MAIN LOGIC: CPI ISOLATION MODE
// ──────────────────────────────────────────────

export const fetchOffers = async (): Promise<Offer[]> => {
  try {
    const ip = await getVisitorIP();

    // 1. Fetch initial batch
    const rawOffers = await fetchFromAPI(ip, 1, 40);

    const mapped: Offer[] = rawOffers.map((o: any, i: number) => ({
      id: o.offerid ?? `off-${i}`,
      title: o.name_short ?? o.name,
      description: o.adcopy ?? o.description,
      url: o.link,
      image: o.picture,
      type: (o.category || "").toUpperCase(),
      epc: parseFloat(o.epc) || 0,
      payout: parseFloat(o.payout) || 0
    }));

    // 2. Filter for CPI / App Install offers
    const cpiOffers = mapped.filter(o =>
      o.type.includes("CPI") ||
      o.type.includes("APP") ||
      o.type.includes("INSTALL")
    );

    // 3. LOGIC: IF JUST ONE (OR MORE) CPI EXISTS -> SHOW ONLY 1
    if (cpiOffers.length > 0) {
      console.log("🔥 CPI MODE ACTIVE: Isolating top install offer.");
      
      // Sort by EPC to pick the highest converter
      const topOffer = cpiOffers.sort((a, b) => b.epc - a.epc)[0];
      
      return [topOffer]; // Returns an array with exactly 1 offer
    }

 
    const pinOffers = mapped
      .filter(o => o.type.includes("PIN") && o.epc >= 0.2)
      .sort((a, b) => b.epc - a.epc);

    if (pinOffers.length > 0) {
      return pinOffers.slice(0, 2);
    }

   
    return mapped
      .sort((a, b) => b.epc - a.epc)
      .slice(0,2 );

  } catch (err) {
    console.error("❌ Offer Fetch Error", err);
    return [];
  }
};