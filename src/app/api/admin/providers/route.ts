import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/roles";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { data, error } = await supabase
      .from("providers")
      .select("id, name, phone, trades, areas, avg_rating, review_count, plan, is_featured, is_claimed, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });

    const providers = (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      phone: p.phone,
      trades: p.trades || [],
      areas: p.areas || [],
      avgRating: p.avg_rating,
      reviewCount: p.review_count,
      plan: p.plan || "free",
      isFeatured: p.is_featured || false,
      isClaimed: p.is_claimed || false,
      createdAt: p.created_at,
    }));

    return NextResponse.json({ providers });
  } catch (error) {
    console.error("Admin providers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
