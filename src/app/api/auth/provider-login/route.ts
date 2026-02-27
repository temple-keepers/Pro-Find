import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/auth/rate-limit";

/**
 * Provider login — requires Supabase Auth session.
 * Looks up the provider profile linked to the authenticated user.
 * No longer accepts phone-only login (security fix).
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit auth attempts
    const rlKey = getRateLimitKey(request, "provider-login");
    const rl = checkRateLimit(rlKey, RATE_LIMITS.auth);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Require Supabase Auth session
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json(
        { error: "Please log in with your email and password first." },
        { status: 401 }
      );
    }

    // Look up provider linked to this auth user
    const { data: provider, error } = await supabase
      .from("providers")
      .select("id, name, phone, is_claimed, trades, areas, avg_rating, review_count, auth_id")
      .eq("auth_id", authUser.id)
      .single();

    if (error || !provider) {
      // Fallback: try matching by phone from the request body
      // but ONLY link it if the phone matches and provider is unclaimed
      const body = await request.json().catch(() => ({}));
      const phone = body.phone?.replace(/[\s\-\(\)]/g, "");

      if (phone && phone.length >= 7) {
        const { data: unlinked } = await supabase
          .from("providers")
          .select("id, name, phone, is_claimed, auth_id")
          .eq("phone", phone)
          .is("auth_id", null)
          .single();

        if (unlinked) {
          // Link this unclaimed provider to the authenticated user
          await supabase
            .from("providers")
            .update({
              auth_id: authUser.id,
              is_claimed: true,
              claimed_at: new Date().toISOString(),
            })
            .eq("id", unlinked.id);

          return NextResponse.json({
            provider: {
              id: unlinked.id,
              name: unlinked.name,
              phone: unlinked.phone,
            },
          });
        }
      }

      return NextResponse.json(
        {
          error:
            "No provider profile linked to your account. Register as a provider or claim your existing profile.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      provider: {
        id: provider.id,
        name: provider.name,
        phone: provider.phone,
      },
    });
  } catch (error) {
    console.error("Provider login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
