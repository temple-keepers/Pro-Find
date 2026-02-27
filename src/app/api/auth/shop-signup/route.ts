import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, shopName, phone, whatsapp, address, area, description, hours, deliveryAvailable } = body;

    if (!email || !password || !shopName || !phone) {
      return NextResponse.json(
        { error: "Email, password, shop name, and phone are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { role: "shop_owner" } },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists. Try logging in." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }

    // 2. Create shop record linked to auth user
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .insert({
        auth_id: authData.user.id,
        name: shopName.trim(),
        phone: phone.trim(),
        whatsapp: (whatsapp || phone).trim(),
        email: email.trim().toLowerCase(),
        address: address?.trim() || null,
        area: area || null,
        description: description?.trim() || null,
        hours: hours?.trim() || null,
        delivery_available: deliveryAvailable || false,
        is_active: true,
      })
      .select("id, name")
      .single();

    if (shopError) {
      console.error("Shop creation error:", shopError);
      return NextResponse.json(
        { error: "Account created but shop setup failed. Please log in and try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, shop: { id: shop.id, name: shop.name } });
  } catch (error) {
    console.error("Shop signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
