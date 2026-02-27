import { NextRequest, NextResponse } from "next/server";
import { updateProviderAvailability } from "@/lib/supabase/queries";
import { requireProviderOwner } from "@/lib/auth/api-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify the authenticated user owns this provider
    const auth = await requireProviderOwner(id);
    if (auth.error) return auth.error;

    const { availableNow } = await request.json();

    const success = await updateProviderAvailability(id, availableNow);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update availability" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, availableNow });
  } catch (error) {
    console.error("Availability toggle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
