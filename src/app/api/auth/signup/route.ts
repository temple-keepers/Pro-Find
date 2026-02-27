import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone, trades, areas, description, yearsExperience, hasBitCert, bitTrade } = body;

    // Validate
    if (!email || !password || !name || !phone || !trades?.length || !areas?.length) {
      return NextResponse.json(
        { error: "All fields are required: email, password, name, phone, trades, areas" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      console.error("Auth signup error:", authError);
      if (authError.message.includes("already registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists. Try logging in instead." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    // 2. Create provider record linked to auth user
    const { data: provider, error: providerError } = await supabase
      .from("providers")
      .insert({
        auth_id: authData.user.id,
        name: name.trim(),
        phone: phone.trim(),
        trades,
        areas,
        description: description?.trim() || null,
        years_experience: yearsExperience ? parseInt(yearsExperience) : null,
        bit_certified: hasBitCert || false,
        bit_trade: bitTrade?.trim() || null,
        is_claimed: true,
        claimed_at: new Date().toISOString(),
        source: "self_registered",
      })
      .select("id, name")
      .single();

    if (providerError) {
      console.error("Provider creation error:", providerError);
      return NextResponse.json(
        { error: "Account created but profile setup failed. Please log in and try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      provider: { id: provider.id, name: provider.name },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
