import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: "https://welovemods.com" });

  const links = [
    { url: "/", priority: 1.0 },
    { url: "/admin-login", priority: 0.8 },
    { url: "/categories", priority: 0.8 },
    { url: "/top-games", priority: 0.8 },
    { url: "/new-games", priority: 0.8 },
    { url: "/all-games", priority: 0.8 },
    { url: "/download", priority: 0.7 },
  ];

  // Example dynamic URLs (you can fetch from API or JSON here)
  const games = [
    { slug: "roblox-mod" },
    { slug: "minecraft-mod" },
    { slug: "toca-life-world" },
  ];
  games.forEach((g) => links.push({ url: `/game/${g.slug}`, priority: 0.6 }));

  // Write each link into the sitemap
  links.forEach((link) => sitemap.write(link));
  sitemap.end();

  // Save to /public/sitemap.xml
  const writeStream = createWriteStream("./public/sitemap.xml");
  const xml = await streamToPromise(sitemap);
  writeStream.write(xml.toString());
  writeStream.end();

  console.log("✅ Sitemap successfully generated at public/sitemap.xml");
}

generateSitemap().catch(console.error);
