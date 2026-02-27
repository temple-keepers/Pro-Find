import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("shops")
      .select("*")
      .eq("is_active", true)
      .order("is_verified", { ascending: false })
      .order("name", { ascending: true });

    if (error) {
      console.error("Shops fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch shops" }, { status: 500 });
    }

    const shops = (data || []).map((s: Record<string, unknown>) => ({
      id: s.id,
      name: s.name,
      phone: s.phone,
      whatsapp: s.whatsapp,
      address: s.address,
      area: s.area,
      description: s.description,
      logoUrl: s.logo_url,
      photoUrl: s.photo_url,
      hours: s.hours,
      isVerified: s.is_verified,
    }));

    return NextResponse.json({ shops });
  } catch (error) {
    console.error("Shops API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
