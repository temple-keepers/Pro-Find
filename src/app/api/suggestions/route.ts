import { NextRequest, NextResponse } from "next/server";
import { createSuggestion } from "@/lib/supabase/queries";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/auth/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit suggestion submissions
    const rlKey = getRateLimitKey(request, "suggestion");
    const rl = checkRateLimit(rlKey, RATE_LIMITS.publicSubmit);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const { providerName, trade, area, phone, description, suggestedByName, suggestedByArea, suggestedByPhone } = body;

    if (!providerName || !trade || !area) {
      return NextResponse.json(
        { error: "Missing required fields: providerName, trade, area" },
        { status: 400 }
      );
    }

    const result = await createSuggestion({
      providerName: providerName.trim(),
      trade,
      area,
      phone: phone?.trim(),
      description: description?.trim(),
      suggestedByName: suggestedByName?.trim(),
      suggestedByArea: suggestedByArea?.trim(),
      suggestedByPhone: suggestedByPhone?.trim(),
    });

    if (!result) {
      return NextResponse.json(
        { error: "Failed to create suggestion" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error("Suggestion API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
