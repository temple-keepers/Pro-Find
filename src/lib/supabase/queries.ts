import { createServerSupabaseClient } from "./server";
import type { Provider, Review, SearchFilters } from "@/lib/types";
import { sanitizeSearchInput } from "@/lib/utils/sanitize";

// ============================================
// PROVIDERS
// ============================================

export async function getProviders(filters: SearchFilters = {}) {
  const supabase = await createServerSupabaseClient();

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
    const sanitized = sanitizeSearchInput(filters.query);
    if (sanitized) {
      query = query.or(
        `name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`
      );
    }
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

export async function getProviderById(id: string): Promise<Provider | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return mapProviderFromDB(data);
}

export async function updateProviderAvailability(
  providerId: string,
  availableNow: boolean
) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("providers")
    .update({
      available_now: availableNow,
      available_now_updated_at: new Date().toISOString(),
    })
    .eq("id", providerId);

  return !error;
}

// ============================================
// REVIEWS
// ============================================

export async function getReviewsForProvider(providerId: string): Promise<Review[]> {
  const supabase = await createServerSupabaseClient();

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

export async function createReview(review: {
  providerId: string;
  reviewerName: string;
  reviewerPhone: string;
  reviewerArea?: string;
  rating: number;
  reviewText?: string;
  jobDescription?: string;
  pricePaid?: number;
  wouldRecommend: boolean;
}) {
  const supabase = await createServerSupabaseClient();

  const phoneHash = await hashPhone(review.reviewerPhone);

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      provider_id: review.providerId,
      reviewer_name: review.reviewerName,
      reviewer_phone_hash: phoneHash,
      reviewer_area: review.reviewerArea || null,
      rating: review.rating,
      review_text: review.reviewText || null,
      job_description: review.jobDescription || null,
      price_paid: review.pricePaid || null,
      would_recommend: review.wouldRecommend,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating review:", error);
    return null;
  }

  return data;
}

// ============================================
// SUGGESTIONS
// ============================================

export async function createSuggestion(suggestion: {
  providerName: string;
  trade: string;
  area: string;
  phone?: string;
  description?: string;
  suggestedByName?: string;
  suggestedByArea?: string;
  suggestedByPhone?: string;
}) {
  const supabase = await createServerSupabaseClient();

  const phoneHash = suggestion.suggestedByPhone
    ? await hashPhone(suggestion.suggestedByPhone)
    : null;

  const { data, error } = await supabase
    .from("suggestions")
    .insert({
      provider_name: suggestion.providerName,
      trade: suggestion.trade,
      area: suggestion.area,
      phone: suggestion.phone || null,
      description: suggestion.description || null,
      suggested_by_name: suggestion.suggestedByName || null,
      suggested_by_area: suggestion.suggestedByArea || null,
      suggested_by_phone_hash: phoneHash,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating suggestion:", error);
    return null;
  }

  return data;
}

// ============================================
// CLAIMS
// ============================================

export async function createProviderClaim(claim: {
  name: string;
  phone: string;
  trades: string[];
  areas: string[];
  description?: string;
  yearsExperience?: number;
  hasBitCert: boolean;
  bitTrade?: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("providers")
    .insert({
      name: claim.name,
      phone: claim.phone,
      trades: claim.trades,
      areas: claim.areas,
      description: claim.description || null,
      years_experience: claim.yearsExperience || null,
      bit_certified: claim.hasBitCert,
      bit_trade: claim.bitTrade || null,
      is_claimed: true,
      claimed_at: new Date().toISOString(),
      source: "self_registered",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating provider claim:", error);
    return null;
  }

  return data;
}

// ============================================
// QUOTES
// ============================================

export async function createQuote(quote: {
  providerId: string;
  customerName?: string;
  customerPhone?: string;
  jobDescription: string;
  materialsItems: object[];
  materialsTotal: number;
  labourCost: number;
  totalCost: number;
  notes?: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("quotes")
    .insert({
      provider_id: quote.providerId,
      customer_name: quote.customerName || null,
      customer_phone: quote.customerPhone || null,
      job_description: quote.jobDescription,
      materials_items: quote.materialsItems,
      materials_total: quote.materialsTotal,
      labour_cost: quote.labourCost,
      total_cost: quote.totalCost,
      notes: quote.notes || null,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating quote:", error);
    return null;
  }

  return data;
}

export async function getQuotesForProvider(providerId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

// ============================================
// JOBS
// ============================================

export async function createJob(job: {
  providerId: string;
  customerName: string;
  customerPhone?: string;
  jobDescription: string;
  totalAgreed?: number;
  quoteId?: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      provider_id: job.providerId,
      customer_name: job.customerName,
      customer_phone: job.customerPhone || null,
      job_description: job.jobDescription,
      total_agreed: job.totalAgreed || null,
      quote_id: job.quoteId || null,
      status: "deposit_paid",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating job:", error);
    return null;
  }

  if (data) {
    await supabase.from("job_milestones").insert({
      job_id: data.id,
      milestone: "deposit_paid",
      note: "Job created",
      logged_by: "provider",
    });
  }

  return data;
}

export async function advanceJobStatus(jobId: string, nextStatus: string, note?: string) {
  const supabase = await createServerSupabaseClient();

  const updates: Record<string, unknown> = { status: nextStatus };
  if (nextStatus === "complete") {
    updates.completed_at = new Date().toISOString();
  }

  const { error: jobError } = await supabase
    .from("jobs")
    .update(updates)
    .eq("id", jobId);

  if (jobError) return false;

  const { error: milestoneError } = await supabase
    .from("job_milestones")
    .insert({
      job_id: jobId,
      milestone: nextStatus,
      note: note || `Marked as ${nextStatus}`,
      logged_by: "provider",
    });

  return !milestoneError;
}

export async function getJobsForProvider(providerId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*, job_milestones(*)")
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

// ============================================
// PROVIDER PROFILE UPDATE
// ============================================

export async function updateProviderProfile(
  providerId: string,
  updates: {
    name?: string;
    phone?: string;
    description?: string;
    trades?: string[];
    areas?: string[];
    yearsExperience?: number | null;
    priceRangeLow?: number | null;
    priceRangeHigh?: number | null;
    servicesOffered?: string[];
    responseTime?: string | null;
    photoUrl?: string | null;
    workPhotos?: string[];
  }
) {
  const supabase = await createServerSupabaseClient();

  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.description !== undefined) dbUpdates.description = updates.description || null;
  if (updates.trades !== undefined) dbUpdates.trades = updates.trades;
  if (updates.areas !== undefined) dbUpdates.areas = updates.areas;
  if (updates.yearsExperience !== undefined) dbUpdates.years_experience = updates.yearsExperience;
  if (updates.priceRangeLow !== undefined) dbUpdates.price_range_low = updates.priceRangeLow;
  if (updates.priceRangeHigh !== undefined) dbUpdates.price_range_high = updates.priceRangeHigh;
  if (updates.servicesOffered !== undefined) dbUpdates.services_offered = updates.servicesOffered;
  if (updates.responseTime !== undefined) dbUpdates.response_time = updates.responseTime;
  if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl;
  if (updates.workPhotos !== undefined) dbUpdates.work_photos = updates.workPhotos;

  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("providers")
    .update(dbUpdates)
    .eq("id", providerId)
    .select()
    .single();

  if (error) {
    console.error("Error updating provider profile:", error);
    return null;
  }

  return mapProviderFromDB(data);
}

// ============================================
// CONTACT EVENTS
// ============================================

export async function logContactEvent(
  providerId: string,
  contactType: "whatsapp" | "call",
  sourcePage: string
) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("contact_events").insert({
    provider_id: providerId,
    contact_type: contactType,
    source_page: sourcePage,
  });

  return !error;
}

// ============================================
// SEARCH LOGS
// ============================================

export async function logSearch(params: {
  query?: string;
  trade?: string;
  area?: string;
  resultsCount: number;
}) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("search_logs").insert({
    query: params.query || null,
    trade: params.trade || null,
    area: params.area || null,
    results_count: params.resultsCount,
  });

  return !error;
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getProviderStats(providerId: string) {
  const supabase = await createServerSupabaseClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const since = thirtyDaysAgo.toISOString();

  const [contacts, reviews, quotes] = await Promise.all([
    supabase
      .from("contact_events")
      .select("id", { count: "exact" })
      .eq("provider_id", providerId)
      .gte("created_at", since),
    supabase
      .from("reviews")
      .select("id", { count: "exact" })
      .eq("provider_id", providerId)
      .gte("created_at", since),
    supabase
      .from("quotes")
      .select("id", { count: "exact" })
      .eq("provider_id", providerId)
      .gte("created_at", since),
  ]);

  return {
    whatsappTaps: contacts.count || 0,
    newReviews: reviews.count || 0,
    quotesSent: quotes.count || 0,
  };
}

export async function getDemandSignals() {
  const supabase = await createServerSupabaseClient();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("search_logs")
    .select("trade")
    .gte("created_at", sevenDaysAgo.toISOString())
    .not("trade", "is", null);

  if (error || !data) return [];

  const counts: Record<string, number> = {};
  for (const row of data) {
    if (row.trade) {
      counts[row.trade] = (counts[row.trade] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([trade, searches]) => ({ trade, searches }))
    .sort((a, b) => b.searches - a.searches);
}

// ============================================
// HELPERS
// ============================================

async function hashPhone(phone: string): Promise<string> {
  const cleaned = phone.replace(/\D/g, "");
  const encoder = new TextEncoder();
  const salt = process.env.PHONE_HASH_SALT || "profind-salt-gy";
  const data = encoder.encode(cleaned + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function mapProviderFromDB(row: Record<string, unknown>): Provider {
  return {
    id: row.id as string,
    name: row.name as string,
    phone: row.phone as string,
    phoneVerified: row.phone_verified as boolean,
    trades: row.trades as string[],
    areas: row.areas as string[],
    description: row.description as string | undefined,
    photoUrl: row.photo_url as string | undefined,
    workPhotos: (row.work_photos as string[]) || [],
    isClaimed: row.is_claimed as boolean,
    isVerified: row.is_verified as boolean,
    isFeatured: row.is_featured as boolean,
    availableNow: row.available_now as boolean,
    availableNowUpdatedAt: row.available_now_updated_at as string | undefined,
    bitCertified: row.bit_certified as boolean,
    bitCertificateUrl: row.bit_certificate_url as string | undefined,
    bitTrade: row.bit_trade as string | undefined,
    avgRating: parseFloat(row.avg_rating as string) || 0,
    reviewCount: (row.review_count as number) || 0,
    responseTime: row.response_time as string | undefined,
    priceRangeLow: row.price_range_low as number | undefined,
    priceRangeHigh: row.price_range_high as number | undefined,
    yearsExperience: row.years_experience as number | undefined,
    servicesOffered: (row.services_offered as string[]) || [],
    createdAt: row.created_at as string,
    claimedAt: row.claimed_at as string | undefined,
    updatedAt: row.updated_at as string,
    source: row.source as Provider["source"],
    sourceDetail: row.source_detail as string | undefined,
  };
}

function mapReviewFromDB(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    providerId: row.provider_id as string,
    reviewerName: row.reviewer_name as string,
    reviewerArea: row.reviewer_area as string | undefined,
    rating: row.rating as number,
    reviewText: row.review_text as string | undefined,
    photos: (row.photos as string[]) || [],
    pricePaid: row.price_paid as number | undefined,
    jobDescription: row.job_description as string | undefined,
    providerResponse: row.provider_response as string | undefined,
    wouldRecommend: row.would_recommend as boolean,
    createdAt: row.created_at as string,
    verified: row.verified as boolean,
  };
}
