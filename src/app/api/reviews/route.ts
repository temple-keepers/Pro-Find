import { NextRequest, NextResponse } from "next/server";
import { createReview } from "@/lib/supabase/queries";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/auth/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit review submissions to prevent spam/bombing
    const rlKey = getRateLimitKey(request, "review");
    const rl = checkRateLimit(rlKey, RATE_LIMITS.review);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many reviews submitted. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const { providerId, reviewerName, reviewerPhone, reviewerArea, rating, reviewText, jobDescription, pricePaid, wouldRecommend } = body;

    // Validate required fields
    if (!providerId || !reviewerName || !reviewerPhone || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: providerId, reviewerName, reviewerPhone, rating" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const result = await createReview({
      providerId,
      reviewerName: reviewerName.trim(),
      reviewerPhone: reviewerPhone.trim(),
      reviewerArea: reviewerArea?.trim(),
      rating,
      reviewText: reviewText?.trim(),
      jobDescription: jobDescription?.trim(),
      pricePaid: pricePaid ? parseInt(pricePaid) : undefined,
      wouldRecommend: wouldRecommend ?? true,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Failed to create review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
