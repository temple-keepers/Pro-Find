import { NextRequest, NextResponse } from "next/server";
import { logContactEvent } from "@/lib/supabase/queries";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/auth/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit analytics to prevent flooding
    const rlKey = getRateLimitKey(request, "contact");
    const rl = checkRateLimit(rlKey, RATE_LIMITS.analytics);
    if (!rl.allowed) {
      return NextResponse.json({ success: true }); // Silent rate limit for analytics
    }

    const body = await request.json();

    const { providerId, contactType, sourcePage } = body;

    if (!providerId) {
      return NextResponse.json(
        { error: "Missing providerId" },
        { status: 400 }
      );
    }

    await logContactEvent(
      providerId,
      contactType || "whatsapp",
      sourcePage || "unknown"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact log error:", error);
    // Don't fail the user experience for analytics
    return NextResponse.json({ success: true });
  }
}
