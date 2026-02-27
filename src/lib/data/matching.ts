/**
 * Provider matching logic for the "Get 3 Quotes" feature.
 * Finds up to 3 verified providers matching a trade + area.
 */

import { createClient } from "@/lib/supabase/client";

export interface MatchedProviderInfo {
  id: string;
  avgRating: number;
  reviewCount: number;
  yearsExperience?: number;
  responseTime?: string;
  isVerified: boolean;
  idVerified: boolean;
}

export interface MatchResult {
  providers: MatchedProviderInfo[];
  matchCount: number;
}

const HAS_SUPABASE =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url_here";

/**
 * Find up to 3 verified providers for a quote request.
 * Prioritizes: verified → highest rated → most reviews.
 */
export async function matchProviders(
  trade: string,
  area: string | null
): Promise<MatchResult> {
  if (!HAS_SUPABASE) {
    return matchFromSeed(trade, area);
  }

  try {
    const supabase = createClient();

    let query = supabase
      .from("providers")
      .select("id, avg_rating, review_count, years_experience, response_time, is_verified, id_verified")
      .contains("trades", [trade])
      .eq("is_verified", true)
      .order("avg_rating", { ascending: false })
      .order("review_count", { ascending: false })
      .limit(3);

    if (area) {
      query = query.contains("areas", [area]);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Fallback: try without area filter
      if (area) {
        return matchProviders(trade, null);
      }
      return { providers: [], matchCount: 0 };
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const providers: MatchedProviderInfo[] = data.map((row: any) => ({
      id: row.id,
      avgRating: parseFloat(row.avg_rating) || 0,
      reviewCount: row.review_count || 0,
      yearsExperience: row.years_experience || undefined,
      responseTime: row.response_time || undefined,
      isVerified: row.is_verified ?? false,
      idVerified: row.id_verified ?? false,
    }));

    return { providers, matchCount: providers.length };
  } catch {
    return { providers: [], matchCount: 0 };
  }
}

async function matchFromSeed(trade: string, area: string | null): Promise<MatchResult> {
  const { SEED_PROVIDERS } = await import("@/lib/data/seed-providers");

  let candidates = SEED_PROVIDERS.filter(
    (p) => p.trades.includes(trade) && p.isVerified
  );

  if (area && candidates.length > 0) {
    const areaFiltered = candidates.filter((p) => p.areas.includes(area));
    if (areaFiltered.length > 0) candidates = areaFiltered;
  }

  candidates.sort((a, b) => {
    if (a.avgRating !== b.avgRating) return b.avgRating - a.avgRating;
    return b.reviewCount - a.reviewCount;
  });

  const top3 = candidates.slice(0, 3).map((p) => ({
    id: p.id,
    avgRating: p.avgRating,
    reviewCount: p.reviewCount,
    yearsExperience: p.yearsExperience,
    responseTime: p.responseTime,
    isVerified: p.isVerified,
    idVerified: p.idVerified,
  }));

  return { providers: top3, matchCount: top3.length };
}
