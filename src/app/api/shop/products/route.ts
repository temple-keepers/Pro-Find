import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/roles";

async function getShopForUser(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>, userId: string) {
  // Try user_id first, then auth_id
  let { data: shop } = await supabase.from("shops").select("id").eq("user_id", userId).single();
  if (!shop) {
    const result = await supabase.from("shops").select("id").eq("auth_id", userId).single();
    shop = result.data;
  }
  return shop;
}

// GET - list products for the authenticated shop owner (or all for admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const admin = isAdminEmail(user.email);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const shopIdFilter = searchParams.get("shopId"); // admin can filter by shop

    // Get user record for user_id lookup
    const { data: appUser } = await supabase.from("users").select("id").eq("auth_id", user.id).single();

    let shopId: string | null = null;

    if (!admin) {
      const shop = await getShopForUser(supabase, appUser?.id || user.id);
      if (!shop) return NextResponse.json({ error: "No shop found" }, { status: 404 });
      shopId = shop.id;
    } else if (shopIdFilter) {
      shopId = shopIdFilter; // Admin filtering specific shop
    }

    let query = supabase.from("materials").select("*").order("created_at", { ascending: false });
    if (shopId) query = query.eq("shop_id", shopId);
    if (category) query = query.eq("category_id", category);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });

    return NextResponse.json({ products: (data || []).map(mapProduct), shopId });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - add a new product
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const admin = isAdminEmail(user.email);
    const { data: appUser } = await supabase.from("users").select("id").eq("auth_id", user.id).single();

    const body = await request.json();
    const { name, categoryId, brand, unit, price, priceWas, description, tradeTags, photoUrl, sku, shopId: targetShopId } = body;

    let shopId = targetShopId; // admin can specify shopId
    if (!admin || !shopId) {
      const shop = await getShopForUser(supabase, appUser?.id || user.id);
      if (!shop) return NextResponse.json({ error: "No shop found" }, { status: 404 });
      shopId = shop.id;
    }

    if (!name || !categoryId || !price || !unit) {
      return NextResponse.json({ error: "Name, category, price, and unit are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("materials")
      .insert({
        shop_id: shopId,
        category_id: categoryId,
        name: name.trim(),
        brand: brand?.trim() || null,
        unit,
        price: parseInt(price),
        price_was: priceWas ? parseInt(priceWas) : null,
        description: description?.trim() || null,
        trade_tags: tradeTags || [],
        photo_url: photoUrl || null,
        sku: sku?.trim() || null,
        in_stock: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Product insert error:", error);
      return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: mapProduct(data) });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - update a product
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const admin = isAdminEmail(user.email);
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbUpdates.name = updates.name.trim();
    if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
    if (updates.brand !== undefined) dbUpdates.brand = updates.brand?.trim() || null;
    if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
    if (updates.price !== undefined) dbUpdates.price = parseInt(updates.price);
    if (updates.priceWas !== undefined) dbUpdates.price_was = updates.priceWas ? parseInt(updates.priceWas) : null;
    if (updates.description !== undefined) dbUpdates.description = updates.description?.trim() || null;
    if (updates.tradeTags !== undefined) dbUpdates.trade_tags = updates.tradeTags;
    if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
    if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl || null;
    if (updates.sku !== undefined) dbUpdates.sku = updates.sku?.trim() || null;

    let query = supabase.from("materials").update(dbUpdates).eq("id", id);

    // Non-admin: restrict to own shop's products
    if (!admin) {
      const { data: appUser } = await supabase.from("users").select("id").eq("auth_id", user.id).single();
      const shop = await getShopForUser(supabase, appUser?.id || user.id);
      if (!shop) return NextResponse.json({ error: "No shop found" }, { status: 404 });
      query = query.eq("shop_id", shop.id);
    }

    const { data, error } = await query.select().single();
    if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 });

    return NextResponse.json({ success: true, product: mapProduct(data) });
  } catch (error) {
    console.error("Products PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - remove a product
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const admin = isAdminEmail(user.email);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    let query = supabase.from("materials").delete().eq("id", id);

    if (!admin) {
      const { data: appUser } = await supabase.from("users").select("id").eq("auth_id", user.id).single();
      const shop = await getShopForUser(supabase, appUser?.id || user.id);
      if (!shop) return NextResponse.json({ error: "No shop found" }, { status: 404 });
      query = query.eq("shop_id", shop.id);
    }

    const { error } = await query;
    if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Products DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function mapProduct(row: Record<string, unknown>) {
  return {
    id: row.id,
    shopId: row.shop_id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    brand: row.brand,
    unit: row.unit,
    price: row.price,
    priceWas: row.price_was,
    inStock: row.in_stock,
    photoUrl: row.photo_url,
    tradeTags: row.trade_tags || [],
    sku: row.sku,
    createdAt: row.created_at,
  };
}
