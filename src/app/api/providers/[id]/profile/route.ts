import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // Map to camelCase for frontend
    return NextResponse.json({
      provider: {
        id: data.id,
        name: data.name,
        phone: data.phone,
        trades: data.trades,
        areas: data.areas,
        description: data.description,
        photoUrl: data.photo_url,
        workPhotos: data.work_photos || [],
        isClaimed: data.is_claimed,
        isVerified: data.is_verified,
        isFeatured: data.is_featured,
        availableNow: data.available_now,
        bitCertified: data.bit_certified,
        avgRating: parseFloat(data.avg_rating) || 0,
        reviewCount: data.review_count || 0,
        responseTime: data.response_time,
        priceRangeLow: data.price_range_low,
        priceRangeHigh: data.price_range_high,
        yearsExperience: data.years_experience,
        servicesOffered: data.services_offered || [],
        source: data.source,
      },
    });
  } catch (error) {
    console.error("Get provider profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
