import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sanitizeSearchInput } from "@/lib/utils/sanitize";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const trade = searchParams.get("trade");
    const search = searchParams.get("q");
    const shopId = searchParams.get("shop");
    const sort = searchParams.get("sort") || "popular"; // popular, price_low, price_high, newest
    const inStockOnly = searchParams.get("inStock") === "true";

    let query = supabase
      .from("materials")
      .select("*, shops!inner(id, name, phone, whatsapp, area, is_verified)");

    if (category) {
      query = query.eq("category_id", category);
    }

    if (trade) {
      query = query.contains("trade_tags", [trade]);
    }

    if (search) {
      const sanitized = sanitizeSearchInput(search);
      if (sanitized) {
        query = query.or(`name.ilike.%${sanitized}%,brand.ilike.%${sanitized}%,description.ilike.%${sanitized}%`);
      }
    }

    if (shopId) {
      query = query.eq("shop_id", shopId);
    }

    if (inStockOnly) {
      query = query.eq("in_stock", true);
    }

    // Sort
    switch (sort) {
      case "price_low":
        query = query.order("price", { ascending: true });
        break;
      case "price_high":
        query = query.order("price", { ascending: false });
        break;
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "popular":
      default:
        query = query
          .order("is_popular", { ascending: false })
          .order("name", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Materials fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
    }

    // Map to camelCase
    const materials = (data || []).map((m: Record<string, unknown>) => ({
      id: m.id,
      shopId: m.shop_id,
      categoryId: m.category_id,
      name: m.name,
      description: m.description,
      brand: m.brand,
      unit: m.unit,
      price: m.price,
      priceWas: m.price_was,
      inStock: m.in_stock,
      photoUrl: m.photo_url,
      tradeTags: m.trade_tags || [],
      isPopular: m.is_popular,
      shop: m.shops ? {
        id: (m.shops as Record<string, unknown>).id,
        name: (m.shops as Record<string, unknown>).name,
        phone: (m.shops as Record<string, unknown>).phone,
        whatsapp: (m.shops as Record<string, unknown>).whatsapp,
        area: (m.shops as Record<string, unknown>).area,
        isVerified: (m.shops as Record<string, unknown>).is_verified,
      } : null,
    }));

    return NextResponse.json({ materials });
  } catch (error) {
    console.error("Materials API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
