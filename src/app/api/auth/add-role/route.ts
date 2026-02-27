import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/auth/roles";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await request.json();
    const { role, ...roleData } = body as { role: UserRole } & Record<string, unknown>;

    if (!["provider", "shop_owner"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Get user
    const { data: user } = await supabase
      .from("users")
      .select("id, roles")
      .eq("auth_id", authUser.id)
      .single();

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.roles?.includes(role)) {
      return NextResponse.json({ error: "You already have this role" }, { status: 400 });
    }

    // Add role
    const updatedRoles = [...(user.roles || []), role];
    await supabase.from("users").update({ roles: updatedRoles, updated_at: new Date().toISOString() }).eq("id", user.id);

    // Create linked record
    if (role === "provider") {
      const { trades, areas, yearsExperience } = roleData as { trades: string[]; areas: string[]; yearsExperience?: string };
      if (!trades || trades.length === 0) {
        return NextResponse.json({ error: "Select at least one trade" }, { status: 400 });
      }

      const { data: existing } = await supabase.from("providers").select("id").eq("user_id", user.id).single();
      if (!existing) {
        await supabase.from("providers").insert({
          auth_id: authUser.id,
          user_id: user.id,
          name: (roleData.name as string) || authUser.email?.split("@")[0] || "Provider",
          phone: (roleData.phone as string) || "",
          trades,
          areas: areas?.length > 0 ? areas : ["gt-georgetown"],
          is_claimed: true,
          source: "self_registered",
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
        });
      }
    }

    if (role === "shop_owner") {
      const { shopName, address, shopArea, description, hours, deliveryAvailable } = roleData as Record<string, unknown>;
      if (!shopName) return NextResponse.json({ error: "Shop name is required" }, { status: 400 });

      const { data: existing } = await supabase.from("shops").select("id").eq("user_id", user.id).single();
      if (!existing) {
        await supabase.from("shops").insert({
          auth_id: authUser.id,
          user_id: user.id,
          name: (shopName as string).trim(),
          phone: (roleData.phone as string) || null,
          whatsapp: (roleData.whatsapp as string) || (roleData.phone as string) || null,
          email: authUser.email,
          address: address ? (address as string).trim() : null,
          area: (shopArea as string) || null,
          description: description ? (description as string).trim() : null,
          hours: hours ? (hours as string).trim() : null,
          delivery_available: (deliveryAvailable as boolean) || false,
          is_active: true,
        });
      }
    }

    return NextResponse.json({ success: true, roles: updatedRoles });
  } catch (error) {
    console.error("Add role error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
