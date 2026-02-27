import { NextRequest, NextResponse } from "next/server";
import { createQuote } from "@/lib/supabase/queries";
import { requireProviderOwner } from "@/lib/auth/api-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { providerId, customerName, customerPhone, jobDescription, materialsItems, materialsTotal, labourCost, totalCost, notes } = body;

    if (!providerId || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the authenticated user owns this provider
    const auth = await requireProviderOwner(providerId);
    if (auth.error) return auth.error;

    const result = await createQuote({
      providerId,
      customerName,
      customerPhone,
      jobDescription,
      materialsItems: materialsItems || [],
      materialsTotal: materialsTotal || 0,
      labourCost: labourCost || 0,
      totalCost: totalCost || 0,
      notes,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Failed to create quote" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error("Quote API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
