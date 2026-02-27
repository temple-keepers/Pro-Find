import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: shop, error } = await supabase
      .from("shops")
      .select("id, name, phone, whatsapp, area, product_count, is_verified")
      .eq("auth_id", user.id)
      .single();

    if (error || !shop) {
      return NextResponse.json({ shop: null, user: { id: user.id, email: user.email } });
    }

    return NextResponse.json({
      shop: { id: shop.id, name: shop.name, phone: shop.phone, productCount: shop.product_count, isVerified: shop.is_verified },
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Shop me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
