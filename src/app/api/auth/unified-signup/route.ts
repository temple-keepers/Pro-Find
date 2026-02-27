import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminEmail, type UserRole } from "@/lib/auth/roles";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/auth/rate-limit";

const VALID_ROLES = ["customer", "provider", "shop_owner"];

export async function POST(request: NextRequest) {
  try {
    // Rate limit signup attempts
    const rlKey = getRateLimitKey(request, "signup");
    const rl = checkRateLimit(rlKey, RATE_LIMITS.auth);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      email, password, name, phone, whatsapp,
      // Role-specific
      role,           // 'customer' | 'provider' | 'shop_owner'
      // Provider fields
      trades, areas, yearsExperience,
      // Shop fields
      shopName, address, shopArea, description, hours, deliveryAvailable,
    } = body;

    // Validate base fields
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    // Validate role is one of the allowed values (prevent role injection)
    if (role && !VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    if (role === "provider" && (!trades || trades.length === 0)) {
      return NextResponse.json({ error: "Select at least one trade" }, { status: 400 });
    }
    if (role === "shop_owner" && !shopName) {
      return NextResponse.json({ error: "Shop name is required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const cleanEmail = email.trim().toLowerCase();

    // 1. Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { name, role } },
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

    // 2. Determine roles
    const roles: UserRole[] = [role || "customer"];
    if (isAdminEmail(cleanEmail) && !roles.includes("admin")) {
      roles.push("admin");
    }

    // 3. Create user record
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        auth_id: authData.user.id,
        email: cleanEmail,
        name: name.trim(),
        phone: phone?.trim() || null,
        whatsapp: whatsapp?.trim() || phone?.trim() || null,
        area: shopArea || null,
        roles,
      })
      .select("id")
      .single();

    if (userError) {
      console.error("User record creation error:", userError);
      return NextResponse.json(
        { error: "Account created but profile setup failed. Please log in and try again." },
        { status: 500 }
      );
    }

    let providerId = null;
    let shopId = null;

    // 4. Create provider record if provider role
    if (roles.includes("provider")) {
      const { data: provider, error: provError } = await supabase
        .from("providers")
        .insert({
          auth_id: authData.user.id,
          user_id: user.id,
          name: name.trim(),
          phone: phone?.trim() || "",
          trades: trades || [],
          areas: areas?.length > 0 ? areas : ["gt-georgetown"],
          is_claimed: true,
          source: "self_registered",
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
        })
        .select("id")
        .single();

      if (provError) {
        console.error("Provider creation error:", provError);
      } else {
        providerId = provider.id;
      }
    }

    // 5. Create shop record if shop_owner role
    if (roles.includes("shop_owner")) {
      const { data: shop, error: shopError } = await supabase
        .from("shops")
        .insert({
          auth_id: authData.user.id,
          user_id: user.id,
          name: (shopName || name).trim(),
          phone: phone?.trim() || null,
          whatsapp: whatsapp?.trim() || phone?.trim() || null,
          email: cleanEmail,
          address: address?.trim() || null,
          area: shopArea || null,
          description: description?.trim() || null,
          hours: hours?.trim() || null,
          delivery_available: deliveryAvailable || false,
          is_active: true,
        })
        .select("id")
        .single();

      if (shopError) {
        console.error("Shop creation error:", shopError);
      } else {
        shopId = shop.id;
      }
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, roles },
      providerId,
      shopId,
    });
  } catch (error) {
    console.error("Unified signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
