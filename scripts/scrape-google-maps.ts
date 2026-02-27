/**
 * Google Maps Scraper for Guyana Tradespeople
 * 
 * Uses the Google Places API (Text Search) to find tradespeople in Guyana.
 * Outputs JSON files ready to import into ProFind's Supabase database.
 * 
 * SETUP:
 * 1. Get a Google Cloud API key with Places API enabled
 * 2. Set GOOGLE_PLACES_API_KEY in your .env.local
 * 3. Run: npx tsx scripts/scrape-google-maps.ts
 * 
 * RATE LIMITS:
 * - Free tier: $200/month credit (~5000 text searches)
 * - Each search returns up to 20 results
 * - We make ~40 searches (8 trades × 5 areas) = ~800 results max
 */

import * as fs from "fs";
import * as path from "path";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error("❌ Set GOOGLE_PLACES_API_KEY in .env.local");
  console.error("   Get one at: https://console.cloud.google.com/apis/credentials");
  console.error("   Enable: Places API (New)");
  process.exit(1);
}

// Trade search queries
const TRADE_SEARCHES = [
  { trade: "plumber", queries: ["plumber", "plumbing services", "pipe repair"] },
  { trade: "electrician", queries: ["electrician", "electrical services", "electrical contractor"] },
  { trade: "ac-technician", queries: ["air conditioning repair", "AC technician", "HVAC"] },
  { trade: "carpenter", queries: ["carpenter", "carpentry", "furniture maker"] },
  { trade: "mason", queries: ["mason", "bricklayer", "concrete contractor", "construction contractor"] },
  { trade: "painter", queries: ["painter", "painting services", "house painter"] },
  { trade: "welder", queries: ["welder", "welding services", "metal fabrication"] },
  { trade: "mechanic", queries: ["auto mechanic", "car repair", "garage"] },
];

// Area search suffixes
const AREA_SUFFIXES = [
  "Georgetown Guyana",
  "East Bank Demerara Guyana",
  "East Coast Demerara Guyana",
  "West Coast Demerara Guyana",
  "Berbice Guyana",
];

// Georgetown bounding box for location bias
const GEORGETOWN_LAT = 6.8013;
const GEORGETOWN_LNG = -58.1551;

interface PlaceResult {
  name: string;
  formatted_address?: string;
  geometry?: {
    location: { lat: number; lng: number };
  };
  formatted_phone_number?: string;
  international_phone_number?: string;
  rating?: number;
  user_ratings_total?: number;
  business_status?: string;
  opening_hours?: { open_now: boolean };
  website?: string;
  place_id: string;
  types?: string[];
}

interface ScrapedProvider {
  source: "google_maps";
  sourceId: string; // Google Place ID
  name: string;
  phone: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  rating: number | null;
  reviewCount: number | null;
  website: string | null;
  trade: string;
  searchQuery: string;
  scrapedAt: string;
  isOpen: boolean | null;
}

async function searchPlaces(query: string): Promise<PlaceResult[]> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", query);
  url.searchParams.set("key", API_KEY!);
  url.searchParams.set("location", `${GEORGETOWN_LAT},${GEORGETOWN_LNG}`);
  url.searchParams.set("radius", "100000"); // 100km radius covers most of coastal Guyana

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.error(`  ⚠️  API error: ${data.status} — ${data.error_message || ""}`);
    return [];
  }

  return data.results || [];
}

async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("key", API_KEY!);
  url.searchParams.set("fields", "name,formatted_address,formatted_phone_number,international_phone_number,rating,user_ratings_total,website,geometry,business_status,opening_hours");

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.status !== "OK") return null;
  return { ...data.result, place_id: placeId };
}

function isInGuyana(result: PlaceResult): boolean {
  const addr = (result.formatted_address || "").toLowerCase();
  if (addr.includes("guyana")) return true;

  // Check coordinates (Guyana rough bounding box)
  if (result.geometry?.location) {
    const { lat, lng } = result.geometry.location;
    return lat >= 1.0 && lat <= 8.5 && lng >= -61.5 && lng <= -56.5;
  }

  return false;
}

function extractGuyanaPhone(phone: string | undefined): string | null {
  if (!phone) return null;
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");
  // Guyana numbers: +592 XXX XXXX (10 digits with country code)
  if (digits.startsWith("592") && digits.length >= 10) {
    return digits.slice(3); // Remove country code
  }
  // Local format: 7 digits
  if (digits.length === 7 && /^[2-6]/.test(digits)) {
    return digits;
  }
  return digits.length >= 6 ? digits : null;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("🔍 ProFind Guyana — Google Maps Scraper");
  console.log("=" .repeat(50));

  const allResults: ScrapedProvider[] = [];
  const seenPlaceIds = new Set<string>();
  let totalSearches = 0;

  for (const tradeConfig of TRADE_SEARCHES) {
    console.log(`\n🔧 Trade: ${tradeConfig.trade.toUpperCase()}`);

    for (const query of tradeConfig.queries) {
      for (const areaSuffix of AREA_SUFFIXES) {
        const fullQuery = `${query} ${areaSuffix}`;
        totalSearches++;

        process.stdout.write(`  Searching: "${fullQuery}"...`);

        try {
          const results = await searchPlaces(fullQuery);
          const guyanaResults = results.filter(isInGuyana);

          let newCount = 0;
          for (const result of guyanaResults) {
            if (seenPlaceIds.has(result.place_id)) continue;
            seenPlaceIds.add(result.place_id);

            // Get detailed info (phone number requires details call)
            const details = await getPlaceDetails(result.place_id);
            await sleep(200); // Rate limit courtesy

            const phone = extractGuyanaPhone(
              details?.international_phone_number || details?.formatted_phone_number
            );

            const provider: ScrapedProvider = {
              source: "google_maps",
              sourceId: result.place_id,
              name: result.name,
              phone,
              address: details?.formatted_address || result.formatted_address || null,
              lat: result.geometry?.location.lat || null,
              lng: result.geometry?.location.lng || null,
              rating: details?.rating || result.rating || null,
              reviewCount: details?.user_ratings_total || result.user_ratings_total || null,
              website: details?.website || null,
              trade: tradeConfig.trade,
              searchQuery: fullQuery,
              scrapedAt: new Date().toISOString(),
              isOpen: details?.opening_hours?.open_now ?? null,
            };

            allResults.push(provider);
            newCount++;
          }

          console.log(` ${guyanaResults.length} found (${newCount} new)`);
        } catch (err) {
          console.log(` ❌ Error`);
          console.error(err);
        }

        await sleep(300); // Rate limit between searches
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Done! ${totalSearches} searches, ${allResults.length} unique providers found`);

  // Write raw results
  const outputDir = path.join(process.cwd(), "scripts", "output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const rawPath = path.join(outputDir, "google-maps-raw.json");
  fs.writeFileSync(rawPath, JSON.stringify(allResults, null, 2));
  console.log(`📄 Raw results: ${rawPath}`);

  // Generate SQL insert statements
  const sqlLines: string[] = [
    "-- Auto-generated from Google Maps scrape",
    `-- Date: ${new Date().toISOString()}`,
    `-- Total: ${allResults.length} providers`,
    "",
    "-- REVIEW THESE BEFORE RUNNING! Not all results will be relevant.",
    "",
  ];

  for (const p of allResults) {
    const escapeSql = (s: string | null) =>
      s ? `'${s.replace(/'/g, "''")}'` : "NULL";

    sqlLines.push(`INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, avg_rating, review_count, is_claimed) VALUES (${escapeSql(p.name)}, ${escapeSql(p.phone)}, ARRAY[${escapeSql(p.trade)}], ARRAY['gt-georgetown'], ${escapeSql(p.address)}, 'google_maps', ${escapeSql(p.sourceId)}, ${p.rating || 0}, ${p.reviewCount || 0}, false) ON CONFLICT DO NOTHING;`);
  }

  const sqlPath = path.join(outputDir, "google-maps-import.sql");
  fs.writeFileSync(sqlPath, sqlLines.join("\n"));
  console.log(`📄 SQL import: ${sqlPath}`);

  // Summary by trade
  console.log("\n📊 Summary by trade:");
  const byTrade: Record<string, number> = {};
  for (const p of allResults) {
    byTrade[p.trade] = (byTrade[p.trade] || 0) + 1;
  }
  for (const [trade, count] of Object.entries(byTrade).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${trade}: ${count}`);
  }

  // Providers with phone numbers (most valuable)
  const withPhone = allResults.filter((p) => p.phone);
  console.log(`\n📞 Providers with phone numbers: ${withPhone.length}/${allResults.length}`);
}

main().catch(console.error);
