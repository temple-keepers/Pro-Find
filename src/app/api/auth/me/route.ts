import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Find provider linked to this auth user
    const { data: provider, error } = await supabase
      .from("providers")
      .select("id, name, phone, trades, areas, avg_rating, review_count, is_claimed, is_verified")
      .eq("auth_id", user.id)
      .single();

    if (error || !provider) {
      // User exists in auth but no provider record yet
      return NextResponse.json({ provider: null, user: { id: user.id, email: user.email } });
    }

    return NextResponse.json({
      provider: {
        id: provider.id,
        name: provider.name,
        phone: provider.phone,
      },
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
