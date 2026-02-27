import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/roles";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Look up user in our users table
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authUser.id)
      .single();

    // If no user record exists yet (e.g. signed up before unified system),
    // auto-create one from the auth user
    if (!user) {
      const roles = ["customer"];
      if (isAdminEmail(authUser.email)) roles.push("admin");

      // Check if they have an existing provider record
      const { data: existingProvider } = await supabase
        .from("providers")
        .select("id, name, phone")
        .eq("auth_id", authUser.id)
        .single();

      if (existingProvider) roles.push("provider");

      // Check if they have an existing shop record
      const { data: existingShop } = await supabase
        .from("shops")
        .select("id, name, phone")
        .eq("auth_id", authUser.id)
        .single();

      if (existingShop) roles.push("shop_owner");

      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          auth_id: authUser.id,
          email: authUser.email || "",
          name: existingProvider?.name || existingShop?.name || authUser.email?.split("@")[0] || "User",
          phone: existingProvider?.phone || existingShop?.phone || null,
          roles,
        })
        .select("*")
        .single();

      if (createError) {
        console.error("Auto-create user error:", createError);
        // Still return basic info so the app doesn't break
        return NextResponse.json({
          user: {
            id: null,
            authId: authUser.id,
            email: authUser.email,
            name: authUser.email?.split("@")[0] || "User",
            roles: isAdminEmail(authUser.email) ? ["customer", "admin"] : ["customer"],
          },
        });
      }

      user = newUser;

      // Link the user_id back to provider/shop if they exist
      if (existingProvider) {
        await supabase.from("providers").update({ user_id: newUser.id }).eq("id", existingProvider.id);
      }
      if (existingShop) {
        await supabase.from("shops").update({ user_id: newUser.id }).eq("id", existingShop.id);
      }
    }

    // Ensure admin email always has admin role
    if (isAdminEmail(user.email) && !user.roles?.includes("admin")) {
      const updatedRoles = [...(user.roles || []), "admin"];
      await supabase.from("users").update({ roles: updatedRoles }).eq("id", user.id);
      user.roles = updatedRoles;
    }

    // Fetch linked provider if applicable
    let providerId = null;
    if (user.roles?.includes("provider")) {
      const { data: prov } = await supabase
        .from("providers")
        .select("id")
        .or(`user_id.eq.${user.id},auth_id.eq.${authUser.id}`)
        .single();
      providerId = prov?.id || null;
    }

    // Fetch linked shop if applicable
    let shopId = null;
    if (user.roles?.includes("shop_owner")) {
      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .or(`user_id.eq.${user.id},auth_id.eq.${authUser.id}`)
        .single();
      shopId = shop?.id || null;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        authId: authUser.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        whatsapp: user.whatsapp,
        area: user.area,
        avatarUrl: user.avatar_url,
        roles: user.roles || ["customer"],
        providerId,
        shopId,
      },
    });
  } catch (error) {
    console.error("Unified me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
