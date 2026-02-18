// ==========================================================
//  Offer Wall - HIGH-PERFORMANCE CPI ISOLATION (API LEVEL)
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
    { url: "https://api.ipify.org", parse: (d: string) => d.trim() },
    { url: "https://ifconfig.me/ip", parse: (d: string) => d.trim() },
    { url: "https://api64.ipify.org?format=json", parse: (d: string) => JSON.parse(d).ip },
    { url: "https://ifconfig.co/json", parse: (d: string) => JSON.parse(d).ip }
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
  return "1.1.1.1"; 
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
// MAIN LOGIC: CPI TOP PERFORMANCE MODE
// ──────────────────────────────────────────────

export const fetchOffers = async (): Promise<Offer[]> => {
  try {
    const ip = await getVisitorIP();

    // 1. Fetch initial batch (Using 1 to 40 to ensure we have a good pool to filter from)
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

    // ──────────────────────────────────────────────
    // ADVANCED SCORING ALGORITHM
    // Prioritizes high payout where EPC is also strong (converting well)
    // ──────────────────────────────────────────────
    const getPerformanceScore = (o: Offer) => {
      // Logic: Payout is good, but Payout * EPC ensures we pick the "top" earners
      // We weight EPC heavily because it proves the offer actually converts.
      return (o.payout * 0.4) + (o.epc * 0.6);
    };

    const sortByPerformance = (a: Offer, b: Offer) => 
      getPerformanceScore(b) - getPerformanceScore(a);

    // 2. Filter for CPI / App Install offers
    let filteredOffers = mapped.filter(o =>
      o.type.includes("CPI") ||
      o.type.includes("APP") ||
      o.type.includes("INSTALL")
    ).sort(sortByPerformance);

    // 3. FALLBACK LOGIC
    // If no CPI offers exist, we fallback to high-performing PIN/General offers
    if (filteredOffers.length === 0) {
      console.log("⚠️ No CPI found. Falling back to top general offers.");
      filteredOffers = mapped
        .filter(o => o.epc > 0.05) // Ensure we don't show dead offers
        .sort(sortByPerformance);
    }

    // 4. FINAL SELECTION: MIN 1, MAX 3
    // We take the top 3 performers from our filtered list
    const finalSelection = filteredOffers.slice(0, 3);

    // Ultimate Safety: If everything failed but we have raw data, show the top raw offer
    if (finalSelection.length === 0 && mapped.length > 0) {
      return [mapped.sort(sortByPerformance)[0]];
    }

    console.log(`✅ Returning ${finalSelection.length} high-performing offers.`);
    return finalSelection;

  } catch (err) {
    console.error("❌ Offer Fetch Error", err);
    return [];
  }
};