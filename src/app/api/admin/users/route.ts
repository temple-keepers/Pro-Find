import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/roles";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, roles, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });

    const users = (data || []).map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      roles: u.roles || ["customer"],
      createdAt: u.created_at,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
