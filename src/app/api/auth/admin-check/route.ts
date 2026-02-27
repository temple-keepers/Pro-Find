import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    return NextResponse.json({ isAdmin: isAdminEmail(user.email) });
  } catch {
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
