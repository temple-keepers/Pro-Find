import type { MetadataRoute } from "next";
import { fetchProviders } from "@/lib/data";
import { TRADES } from "@/lib/data/trades";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://profindguyana.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/suggest`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/price-guide`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Trade landing pages (SEO-optimized)
  const tradeLandingPages: MetadataRoute.Sitemap = TRADES.map((trade) => ({
    url: `${siteUrl}/trades/${trade.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Trade-specific search pages
  const tradePages: MetadataRoute.Sitemap = TRADES.map((trade) => ({
    url: `${siteUrl}/search?trade=${trade.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Provider profile pages
  let providerPages: MetadataRoute.Sitemap = [];
  try {
    const providers = await fetchProviders();
    providerPages = providers.map((p) => ({
      url: `${siteUrl}/provider/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // If fetch fails, skip dynamic pages
  }

  return [...staticPages, ...tradeLandingPages, ...tradePages, ...providerPages];
}
