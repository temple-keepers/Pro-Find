import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/roles";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { data, error } = await supabase
      .from("quote_requests")
      .select("id, customer_name, customer_phone, trade, urgency, status, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });

    const quotes = (data || []).map((q) => ({
      id: q.id,
      customerName: q.customer_name,
      customerPhone: q.customer_phone,
      trade: q.trade,
      urgency: q.urgency,
      status: q.status || "open",
      createdAt: q.created_at,
    }));

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Admin quotes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
