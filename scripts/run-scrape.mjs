// Quick Google Places API scraper — run with: node scripts/run-scrape.mjs

const API_KEY = "AIzaSyAVtLgV9ZTs6o6ZD0nkxCQAOcoQvSNaSaM";

const SEARCHES = [
  { query: "plumber in Georgetown Guyana", trade: "plumber" },
  { query: "plumbing services Georgetown Guyana", trade: "plumber" },
  { query: "electrician in Georgetown Guyana", trade: "electrician" },
  { query: "electrical services Georgetown Guyana", trade: "electrician" },
  { query: "air conditioning repair Georgetown Guyana", trade: "ac-technician" },
  { query: "AC technician Georgetown Guyana", trade: "ac-technician" },
  { query: "carpenter Georgetown Guyana", trade: "carpenter" },
  { query: "carpentry furniture Georgetown Guyana", trade: "carpenter" },
  { query: "mason contractor Georgetown Guyana", trade: "mason" },
  { query: "construction contractor Georgetown Guyana", trade: "mason" },
  { query: "painter Georgetown Guyana", trade: "painter" },
  { query: "painting services Georgetown Guyana", trade: "painter" },
  { query: "welder Georgetown Guyana", trade: "welder" },
  { query: "welding fabrication Georgetown Guyana", trade: "welder" },
  { query: "auto mechanic Georgetown Guyana", trade: "mechanic" },
  { query: "car repair garage Georgetown Guyana", trade: "mechanic" },
  { query: "plumber East Bank Demerara Guyana", trade: "plumber" },
  { query: "electrician East Coast Demerara Guyana", trade: "electrician" },
  { query: "contractor builder Guyana", trade: "mason" },
  { query: "home repair services Georgetown Guyana", trade: "carpenter" },
];

const seen = new Set();
const allProviders = [];

async function searchPlaces(query) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}&location=6.8013,-58.1551&radius=80000`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.error(`  ⚠️  ${data.status}: ${data.error_message || ""}`);
  }
  return data.results || [];
}

async function getDetails(placeId) {
  const fields = "name,formatted_address,formatted_phone_number,international_phone_number,rating,user_ratings_total,website,opening_hours,geometry";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result || null;
}

function isInGuyana(result) {
  const addr = (result.formatted_address || "").toLowerCase();
  if (addr.includes("guyana")) return true;
  const loc = result.geometry?.location;
  if (loc) return loc.lat >= 1 && loc.lat <= 8.5 && loc.lng >= -61.5 && loc.lng <= -56.5;
  return false;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log("🔍 ProFind — Google Places API Scraper");
  console.log("=".repeat(50));

  for (const { query, trade } of SEARCHES) {
    process.stdout.write(`\n🔎 "${query}"... `);

    try {
      const results = await searchPlaces(query);
      const guyana = results.filter(isInGuyana);
      let newCount = 0;

      for (const r of guyana) {
        if (seen.has(r.place_id)) continue;
        seen.add(r.place_id);

        // Get phone number (requires details call)
        const details = await getDetails(r.place_id);
        await sleep(150);

        const phone = details?.international_phone_number || details?.formatted_phone_number || null;
        const provider = {
          name: r.name,
          phone,
          address: details?.formatted_address || r.formatted_address,
          trade,
          rating: details?.rating || r.rating || null,
          reviews: details?.user_ratings_total || r.user_ratings_total || 0,
          website: details?.website || null,
          placeId: r.place_id,
          lat: r.geometry?.location?.lat,
          lng: r.geometry?.location?.lng,
        };

        allProviders.push(provider);
        newCount++;
        console.log(`\n   ✅ ${provider.name} | ${phone || "no phone"} | ⭐${provider.rating || "?"} (${provider.reviews} reviews)`);
      }

      if (newCount === 0 && guyana.length === 0) console.log("0 Guyana results");
      else if (newCount === 0) console.log(`${guyana.length} results (all duplicates)`);
    } catch (err) {
      console.log(`❌ ${err.message}`);
    }

    await sleep(200);
  }

  console.log("\n\n" + "=".repeat(50));
  console.log(`✅ TOTAL: ${allProviders.length} unique providers found`);
  console.log("=".repeat(50));

  // Print summary table
  console.log("\n📋 ALL PROVIDERS:\n");
  console.log("Name | Phone | Trade | Rating | Reviews | Address");
  console.log("-".repeat(120));
  for (const p of allProviders) {
    console.log(`${p.name} | ${p.phone || "—"} | ${p.trade} | ${p.rating || "—"} | ${p.reviews} | ${p.address?.substring(0, 50)}`);
  }

  // Write JSON
  const fs = await import("fs");
  const path = await import("path");
  const outDir = path.join(process.cwd(), "scripts", "output");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "google-places-results.json"),
    JSON.stringify(allProviders, null, 2)
  );
  console.log(`\n📄 Saved to scripts/output/google-places-results.json`);

  // Generate SQL
  const sqlLines = [
    `-- Google Places API scrape — ${new Date().toISOString()}`,
    `-- ${allProviders.length} providers found`,
    `-- REVIEW BEFORE IMPORTING\n`,
  ];

  for (const p of allProviders) {
    const esc = (s) => s ? `'${s.replace(/'/g, "''")}'` : "NULL";
    const phoneClean = p.phone ? p.phone.replace(/[^\d]/g, "").replace(/^592/, "") : null;
    sqlLines.push(
      `INSERT INTO providers (name, phone, trades, areas, description, source, source_detail, avg_rating, review_count, is_claimed) VALUES (${esc(p.name)}, ${esc(phoneClean)}, ARRAY[${esc(p.trade)}], ARRAY['gt-georgetown'], ${esc(p.address)}, 'google_maps', ${esc(p.placeId)}, ${p.rating || 0}, ${p.reviews || 0}, false) ON CONFLICT DO NOTHING;`
    );
  }

  fs.writeFileSync(
    path.join(outDir, "google-places-import.sql"),
    sqlLines.join("\n")
  );
  console.log(`📄 Saved to scripts/output/google-places-import.sql`);

  // Trade breakdown
  const byTrade = {};
  for (const p of allProviders) {
    byTrade[p.trade] = (byTrade[p.trade] || 0) + 1;
  }
  console.log("\n📊 By trade:");
  for (const [t, c] of Object.entries(byTrade).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${t}: ${c}`);
  }

  const withPhone = allProviders.filter(p => p.phone);
  console.log(`\n📞 With phone: ${withPhone.length}/${allProviders.length}`);
}

main().catch(console.error);
