/* ─────────────────────────────────────────────
   GEO / IP DETECTION  –  Multi-provider fallback
───────────────────────────────────────────── */

export interface GeoInfo {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
}

const UNKNOWN_GEO: GeoInfo = { ip: "Unknown", country: "Unknown", countryCode: "", city: "Unknown" };

async function tryIpApi(): Promise<GeoInfo | null> {
  try {
    const r = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
    if (!r.ok) return null;
    const d = await r.json();
    return {
      ip: d.ip ?? "Unknown",
      country: d.country_name ?? d.country ?? "Unknown",
      countryCode: (d.country_code ?? "").toUpperCase(),
      city: d.city ?? "Unknown",
    };
  } catch { return null; }
}

async function tryIpWho(): Promise<GeoInfo | null> {
  try {
    const r = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(4000) });
    if (!r.ok) return null;
    const d = await r.json();
    if (!d.success) return null;
    return {
      ip: d.ip ?? "Unknown",
      country: d.country ?? "Unknown",
      countryCode: (d.country_code ?? "").toUpperCase(),
      city: d.city ?? "Unknown",
    };
  } catch { return null; }
}

async function tryIpInfo(): Promise<GeoInfo | null> {
  try {
    const r = await fetch("https://ipinfo.io/json", { signal: AbortSignal.timeout(4000) });
    if (!r.ok) return null;
    const d = await r.json();
    return {
      ip: d.ip ?? "Unknown",
      country: d.country ?? "Unknown",
      countryCode: (d.country ?? "").toUpperCase(),
      city: d.city ?? "Unknown",
    };
  } catch { return null; }
}

async function tryCheckIp(): Promise<GeoInfo | null> {
  try {
    const r = await fetch("https://checkip.amazonaws.com", { signal: AbortSignal.timeout(4000) });
    if (!r.ok) return null;
    const ip = (await r.text()).trim();
    return { ip, country: "Unknown", countryCode: "", city: "Unknown" };
  } catch { return null; }
}

/** IP-only fallback services */
async function getVisitorIP(): Promise<string> {
  const services = [
    { url: "https://1.1.1.1/cdn-cgi/trace",      parse: (d: string) => d.match(/ip=(.*)/)?.[1]?.trim() },
    { url: "https://checkip.amazonaws.com",       parse: (d: string) => d.trim() },
    { url: "https://api.ipify.org",               parse: (d: string) => d.trim() },
    { url: "https://ifconfig.me/ip",              parse: (d: string) => d.trim() },
    { url: "https://api64.ipify.org?format=json", parse: (d: string) => JSON.parse(d).ip },
    { url: "https://ifconfig.co/json",            parse: (d: string) => JSON.parse(d).ip },
  ];

  // Race all services — first valid IP wins
  const promises = services.map(async (svc) => {
    try {
      const r = await fetch(svc.url, { signal: AbortSignal.timeout(5000) });
      const text = await r.text();
      const ip = svc.parse(text);
      if (ip && ip !== "Unknown") return ip;
    } catch { /* skip */ }
    return null;
  });

  const results = await Promise.allSettled(promises);
  for (const r of results) {
    if (r.status === "fulfilled" && r.value) return r.value;
  }

  return "Unknown";
}

/** Try multiple geo services in order, fall back to IP-only detection */
export async function detectGeo(): Promise<GeoInfo> {
  // First try full geo providers (country + city + ip)
  const providers = [tryIpApi, tryIpWho, tryIpInfo, tryCheckIp];
  for (const provider of providers) {
    const result = await provider();
    if (result && result.ip !== "Unknown") return result;
  }

  // If all geo providers failed, at least get the IP from fallback services
  const ip = await getVisitorIP();
  if (ip !== "Unknown") {
    return { ip, country: "Unknown", countryCode: "", city: "Unknown" };
  }

  return UNKNOWN_GEO;
}

/* ─────────────────────────────────────────────
   TRAFFIC SOURCE DETECTION
───────────────────────────────────────────── */

export function detectTrafficSource(): string {
  const ref = document.referrer;
  const params = new URLSearchParams(window.location.search);

  // UTM source
  const utm = params.get("utm_source");
  if (utm) return `UTM: ${utm}`;

  // Known referrers
  if (!ref) return "Direct";

  try {
    const host = new URL(ref).hostname.toLowerCase();
    if (host.includes("google")) return "Google Search";
    if (host.includes("facebook") || host.includes("fb.com")) return "Facebook";
    if (host.includes("instagram")) return "Instagram";
    if (host.includes("tiktok")) return "TikTok";
    if (host.includes("youtube")) return "YouTube";
    if (host.includes("twitter") || host.includes("x.com")) return "X (Twitter)";
    if (host.includes("reddit")) return "Reddit";
    if (host.includes("t.me") || host.includes("telegram")) return "Telegram";
    if (host.includes("pinterest")) return "Pinterest";
    if (host.includes("bing")) return "Bing";
    if (host.includes("yahoo")) return "Yahoo";
    if (host.includes("duckduckgo")) return "DuckDuckGo";
    if (host.includes("baidu")) return "Baidu";
    // Fallback: show domain
    return `Ref: ${host}`;
  } catch {
    return `Ref: ${ref.slice(0, 40)}`;
  }
}

/* ─────────────────────────────────────────────
   DEVICE DETECTION
───────────────────────────────────────────── */

export function isDesktop(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua);
  return !mobile;
}

/* ─────────────────────────────────────────────
   DEDUPLICATED TELEGRAM NOTIFICATION
   — 1 notification per unique device fingerprint
───────────────────────────────────────────── */

const TELEGRAM_BOT_TOKEN = "7912646322:AAFaxiD7bfPj9dn35_kLep_YGfr5PyvrSZE";
const TELEGRAM_CHAT_ID = "6180902575";
const SENT_KEY = "tg_sent_devices";

function getDeviceId(): string {
  let id = localStorage.getItem("device_uid");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_uid", id);
  }
  return id;
}

export async function sendTelegramNotification(gameName: string) {
  try {
    const deviceId = getDeviceId();

    // Check if already sent for this device
    const sent = JSON.parse(localStorage.getItem(SENT_KEY) || "[]") as string[];
    if (sent.includes(deviceId)) return;

    const geo = await detectGeo();
    const source = detectTrafficSource();
    const device = isDesktop() ? "🖥️ Desktop" : "📱 Mobile";

    const msg =
      `🎮 *New Download Intent*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *Game:* ${gameName}\n` +
      `🌍 *Country:* ${geo.country} — ${geo.city}\n` +
      `🔗 *IP:* \`${geo.ip}\`\n` +
      `📊 *Source:* ${source}\n` +
      `${device}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━`;

    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: msg,
          parse_mode: "Markdown",
        }),
      }
    );

    // Mark this device as sent
    sent.push(deviceId);
    localStorage.setItem(SENT_KEY, JSON.stringify(sent));
  } catch {
    // Never block UX
  }
}
