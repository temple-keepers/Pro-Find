import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/auth/rate-limit";
import { requireAuth } from "@/lib/auth/api-auth";
import { getAdminEmails } from "@/lib/auth/api-auth";

export async function POST(request: NextRequest) {
  try {
    // Rate limit claim submissions
    const rlKey = getRateLimitKey(request, "claim");
    const rl = checkRateLimit(rlKey, RATE_LIMITS.publicSubmit);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const {
      name,
      phone,
      trades,
      areas,
      description,
      yearsExperience,
      hasBitCert,
      bitTrade,
      // Admin fields — only allowed for authenticated admins
      source,
      sourceDetail,
      priceRangeLow,
      priceRangeHigh,
      servicesOffered,
    } = body;

    if (!name || !phone || !trades?.length || !areas?.length) {
      return NextResponse.json(
        { error: "Missing required fields: name, phone, trades, areas" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Check if admin fields are being passed — require admin auth
    let isAdmin = false;
    if (source || sourceDetail) {
      const auth = await requireAuth();
      if (auth.error) return auth.error;
      isAdmin = getAdminEmails().includes(auth.user.email.toLowerCase().trim());
      if (!isAdmin) {
        return NextResponse.json(
          { error: "Admin fields (source, sourceDetail) require admin access" },
          { status: 403 }
        );
      }
    }

    // Check for duplicate phone number
    const { data: existing } = await supabase
      .from("providers")
      .select("id")
      .eq("phone", phone.trim())
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "A provider with this phone number already exists. Try logging in instead." },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("providers")
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        trades,
        areas,
        description: description?.trim() || null,
        years_experience: yearsExperience ? parseInt(yearsExperience) : null,
        bit_certified: hasBitCert || false,
        bit_trade: bitTrade?.trim() || null,
        is_claimed: isAdmin && source ? false : true,
        claimed_at: isAdmin && source ? null : new Date().toISOString(),
        source: isAdmin ? (source || "self_registered") : "self_registered",
        source_detail: isAdmin ? (sourceDetail?.trim() || null) : null,
        price_range_low: priceRangeLow ? parseInt(priceRangeLow) : null,
        price_range_high: priceRangeHigh ? parseInt(priceRangeHigh) : null,
        services_offered: servicesOffered || [],
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating provider:", error);
      return NextResponse.json(
        { error: "Failed to create provider" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Claim API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
