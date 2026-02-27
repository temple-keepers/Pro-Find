import { NextRequest, NextResponse } from "next/server";
import { logSearch } from "@/lib/supabase/queries";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/auth/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit search logging
    const rlKey = getRateLimitKey(request, "search-log");
    const rl = checkRateLimit(rlKey, RATE_LIMITS.analytics);
    if (!rl.allowed) {
      return NextResponse.json({ success: true }); // Silent rate limit
    }

    const body = await request.json();

    await logSearch({
      query: body.query,
      trade: body.trade,
      area: body.area,
      resultsCount: body.resultsCount || 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Silent fail — don't break search for analytics
    return NextResponse.json({ success: true });
  }
}
