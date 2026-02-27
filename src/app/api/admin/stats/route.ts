import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/roles";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const [usersRes, providersRes, shopsRes, productsRes, quotesRes, openQuotesRes, proProvidersRes, proShopsRes] = await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("providers").select("id", { count: "exact", head: true }),
      supabase.from("shops").select("id", { count: "exact", head: true }),
      supabase.from("materials").select("id", { count: "exact", head: true }),
      supabase.from("quote_requests").select("id", { count: "exact", head: true }),
      supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("providers").select("id", { count: "exact", head: true }).neq("plan", "free").not("plan", "is", null),
      supabase.from("shops").select("id", { count: "exact", head: true }).neq("plan", "free").not("plan", "is", null),
    ]);

    return NextResponse.json({
      totalUsers: usersRes.count || 0,
      totalProviders: providersRes.count || 0,
      totalShops: shopsRes.count || 0,
      totalProducts: productsRes.count || 0,
      totalQuoteRequests: quotesRes.count || 0,
      openQuoteRequests: openQuotesRes.count || 0,
      proProviders: proProvidersRes.count || 0,
      proShops: proShopsRes.count || 0,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
