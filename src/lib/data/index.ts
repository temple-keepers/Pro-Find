/**
 * Data layer that uses Supabase when configured, falls back to seed data.
 * Works in both client and server components.
 * 
 * Client components use the browser Supabase client directly.
 * Server components use the server Supabase client (via queries.ts).
 */

import { Provider, Review, SearchFilters } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { getSlotLimit } from "@/lib/data/trust";

const HAS_SUPABASE =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url_here";

// ============================================
// DB → Frontend type mapping
// ============================================

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProviderFromDB(row: any): Provider {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone || "",
    phoneVerified: row.phone_verified ?? false,
    trades: row.trades || [],
    areas: row.areas || [],
    description: row.description || "",
    photoUrl: row.photo_url || undefined,
    workPhotos: row.work_photos || [],
    isClaimed: row.is_claimed ?? false,
    isVerified: row.is_verified ?? false,
    isFeatured: row.is_featured ?? false,
    availableNow: row.available_now ?? false,
    availableNowUpdatedAt: row.available_now_updated_at || undefined,
    bitCertified: row.bit_certified ?? false,
    bitTrade: row.bit_trade || undefined,
    avgRating: parseFloat(row.avg_rating) || 0,
    reviewCount: row.review_count || 0,
    responseTime: row.response_time || undefined,
    priceRangeLow: row.price_range_low || undefined,
    priceRangeHigh: row.price_range_high || undefined,
    yearsExperience: row.years_experience || undefined,
    servicesOffered: row.services_offered || [],
    createdAt: row.created_at,
    claimedAt: row.claimed_at || undefined,
    updatedAt: row.updated_at,
    source: row.source || undefined,
    sourceDetail: row.source_detail || undefined,
    idVerified: row.id_verified ?? false,
    verifiedAt: row.verified_at || undefined,
    idVerificationMethod: row.id_verification_method || undefined,
  };
}

function mapReviewFromDB(row: any): Review {
  return {
    id: row.id,
    providerId: row.provider_id,
    reviewerName: row.reviewer_name,
    reviewerArea: row.reviewer_area || undefined,
    rating: row.rating,
    reviewText: row.review_text || "",
    photos: row.photos || [],
    pricePaid: row.price_paid || undefined,
    jobDescription: row.job_description || undefined,
    wouldRecommend: row.would_recommend ?? true,
    createdAt: row.created_at,
    verified: row.verified ?? false,
  };
}

// ============================================
// Supabase queries (client-safe — no next/headers)
// ============================================

async function supabaseFetchProviders(filters: SearchFilters = {}): Promise<Provider[]> {
  const supabase = createClient();

  let query = supabase.from("providers").select("*");

  if (filters.trade) {
    query = query.contains("trades", [filters.trade]);
  }
  if (filters.area) {
    query = query.contains("areas", [filters.area]);
  }
  if (filters.availableNow) {
    query = query.eq("available_now", true);
  }
  if (filters.bitCertifiedOnly) {
    query = query.eq("bit_certified", true);
  }
  if (filters.query) {
    query = query.or(
      `name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
    );
  }

  switch (filters.sortBy) {
    case "reviews":
      query = query.order("review_count", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "rating":
    default:
      query = query
        .order("is_featured", { ascending: false })
        .order("avg_rating", { ascending: false })
        .order("review_count", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching providers:", error);
    return [];
  }

  return (data || []).map(mapProviderFromDB);
}

async function supabaseFetchProviderById(id: string): Promise<Provider | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapProviderFromDB(data);
}

async function supabaseFetchReviews(providerId: string): Promise<Review[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return (data || []).map(mapReviewFromDB);
}

// ============================================
// PUBLIC API
// ============================================

export async function fetchProviders(filters: SearchFilters = {}): Promise<Provider[]> {
  if (HAS_SUPABASE) {
    return supabaseFetchProviders(filters);
  }

  const { searchProviders } = await import("@/lib/data/seed-providers");
  return searchProviders({
    trade: filters.trade,
    area: filters.area,
    query: filters.query,
    availableNow: filters.availableNow,
    bitCertifiedOnly: filters.bitCertifiedOnly,
    sortBy: filters.sortBy,
  });
}

export async function fetchProviderById(id: string): Promise<Provider | null> {
  if (HAS_SUPABASE) {
    return supabaseFetchProviderById(id);
  }

  const { SEED_PROVIDERS } = await import("@/lib/data/seed-providers");
  return SEED_PROVIDERS.find((p) => p.id === id) || null;
}

export async function fetchReviewsForProvider(providerId: string): Promise<Review[]> {
  if (HAS_SUPABASE) {
    return supabaseFetchReviews(providerId);
  }

  const { getReviewsForProvider: getSeedReviews } = await import("@/lib/data/seed-providers");
  return getSeedReviews(providerId);
}

export async function fetchRecentReviews(limit = 6): Promise<(Review & { providerName?: string; providerTrade?: string })[]> {
  if (HAS_SUPABASE) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*, providers!inner(name, trades)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map((row: any) => ({
      ...mapReviewFromDB(row),
      providerName: row.providers?.name,
      providerTrade: row.providers?.trades?.[0],
    }));
  }

  // Fallback: gather reviews from all seed providers
  const { SEED_PROVIDERS, getReviewsForProvider: getSeedReviews } = await import("@/lib/data/seed-providers");
  const allReviews: (Review & { providerName?: string; providerTrade?: string })[] = [];
  for (const p of SEED_PROVIDERS) {
    const reviews = getSeedReviews(p.id);
    for (const r of reviews) {
      allReviews.push({ ...r, providerName: p.name, providerTrade: p.trades[0] });
    }
  }
  allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return allReviews.slice(0, limit);
}

export interface SlotUsage {
  filled: number;
  limit: number;
  tradeId: string;
  area?: string;
}

export async function fetchSlotUsage(tradeId: string, area?: string): Promise<SlotUsage> {
  const limit = getSlotLimit(tradeId);

  if (HAS_SUPABASE) {
    const supabase = createClient();
    let query = supabase
      .from("providers")
      .select("id", { count: "exact", head: true })
      .contains("trades", [tradeId])
      .eq("is_verified", true);

    if (area) {
      query = query.contains("areas", [area]);
    }

    const { count } = await query;
    return { filled: count || 0, limit, tradeId, area };
  }

  // Seed fallback
  const { SEED_PROVIDERS } = await import("@/lib/data/seed-providers");
  let candidates = SEED_PROVIDERS.filter(
    (p) => p.trades.includes(tradeId) && p.isVerified
  );
  if (area) {
    const areaFiltered = candidates.filter((p) => p.areas.includes(area));
    if (areaFiltered.length > 0) candidates = areaFiltered;
  }
  return { filled: candidates.length, limit, tradeId, area };
}
