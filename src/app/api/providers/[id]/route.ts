import { NextRequest, NextResponse } from "next/server";
import { updateProviderProfile } from "@/lib/supabase/queries";
import { requireProviderOwner } from "@/lib/auth/api-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Provider ID is required" },
        { status: 400 }
      );
    }

    // Verify the authenticated user owns this provider
    const auth = await requireProviderOwner(id);
    if (auth.error) return auth.error;

    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pin: _pin, ...updates } = body;

    // Sanitize and validate updates
    const sanitized: Record<string, unknown> = {};

    if (updates.name !== undefined) {
      const name = String(updates.name).trim();
      if (name.length < 2 || name.length > 100) {
        return NextResponse.json(
          { error: "Name must be 2-100 characters" },
          { status: 400 }
        );
      }
      sanitized.name = name;
    }

    if (updates.phone !== undefined) {
      const phone = String(updates.phone).trim();
      if (phone.length < 7) {
        return NextResponse.json(
          { error: "Invalid phone number" },
          { status: 400 }
        );
      }
      sanitized.phone = phone;
    }

    if (updates.description !== undefined) {
      sanitized.description = String(updates.description).trim().slice(0, 1000);
    }

    if (updates.trades !== undefined) {
      if (!Array.isArray(updates.trades) || updates.trades.length === 0) {
        return NextResponse.json(
          { error: "At least one trade is required" },
          { status: 400 }
        );
      }
      sanitized.trades = updates.trades;
    }

    if (updates.areas !== undefined) {
      if (!Array.isArray(updates.areas) || updates.areas.length === 0) {
        return NextResponse.json(
          { error: "At least one area is required" },
          { status: 400 }
        );
      }
      sanitized.areas = updates.areas;
    }

    if (updates.yearsExperience !== undefined) {
      const yrs = parseInt(updates.yearsExperience);
      sanitized.yearsExperience = isNaN(yrs) ? null : Math.min(Math.max(yrs, 0), 60);
    }

    if (updates.priceRangeLow !== undefined) {
      const val = parseInt(updates.priceRangeLow);
      sanitized.priceRangeLow = isNaN(val) ? null : Math.max(val, 0);
    }

    if (updates.priceRangeHigh !== undefined) {
      const val = parseInt(updates.priceRangeHigh);
      sanitized.priceRangeHigh = isNaN(val) ? null : Math.max(val, 0);
    }

    if (updates.servicesOffered !== undefined) {
      sanitized.servicesOffered = Array.isArray(updates.servicesOffered)
        ? updates.servicesOffered.map((s: string) => String(s).trim()).filter(Boolean)
        : [];
    }

    if (updates.responseTime !== undefined) {
      sanitized.responseTime = updates.responseTime || null;
    }

    if (updates.photoUrl !== undefined) {
      sanitized.photoUrl = updates.photoUrl || null;
    }

    if (updates.workPhotos !== undefined) {
      sanitized.workPhotos = Array.isArray(updates.workPhotos)
        ? updates.workPhotos.filter((u: string) => typeof u === "string" && u.startsWith("http"))
        : [];
    }

    const result = await updateProviderProfile(id, sanitized);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to update profile. Check provider ID and try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, provider: result });
  } catch (error) {
    console.error("Provider update API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
