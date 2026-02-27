import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/roles";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { data, error } = await supabase
      .from("shops")
      .select("id, name, phone, area, plan, product_count, is_featured, is_active, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });

    const shops = (data || []).map((s) => ({
      id: s.id,
      name: s.name,
      phone: s.phone,
      area: s.area,
      plan: s.plan || "free",
      productCount: s.product_count || 0,
      isFeatured: s.is_featured || false,
      isActive: s.is_active !== false,
      createdAt: s.created_at,
    }));

    return NextResponse.json({ shops });
  } catch (error) {
    console.error("Admin shops error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
