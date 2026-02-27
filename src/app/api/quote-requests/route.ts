import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/roles";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/auth/rate-limit";

// POST - customer submits a quote request
export async function POST(request: NextRequest) {
  try {
    // Rate limit quote request submissions
    const rlKey = getRateLimitKey(request, "quote-request");
    const rl = checkRateLimit(rlKey, RATE_LIMITS.publicSubmit);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { customerName, customerPhone, customerArea, trade, jobDescription, budgetRange, urgency } = body;

    if (!customerName || !customerPhone || !trade || !jobDescription) {
      return NextResponse.json(
        { error: "Name, phone, trade, and job description are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_area: customerArea || null,
        trade,
        job_description: jobDescription.trim(),
        budget_range: budgetRange || null,
        urgency: urgency || "flexible",
        status: "open",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Quote request error:", error);
      return NextResponse.json({ error: "Failed to submit quote request" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Quote request API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET - providers fetch open quote requests (Pro feature)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify authenticated provider
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Check provider exists and is Pro
    const { data: provider } = await supabase
      .from("providers")
      .select("id, plan, trades")
      .eq("auth_id", user.id)
      .single();

    const admin = isAdminEmail(user.email);

    if (!provider && !admin) return NextResponse.json({ error: "No provider found" }, { status: 404 });

    // Only Pro+ or admin can see leads
    if (!admin && (!provider || provider.plan === "free" || !provider.plan)) {
      return NextResponse.json({
        error: "Upgrade to Pro to see quote requests",
        requiresUpgrade: true,
      }, { status: 403 });
    }

    // Fetch open quote requests — admin sees all, providers see their trades
    let query = supabase
      .from("quote_requests")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!admin && provider?.trades?.length) {
      query = query.in("trade", provider.trades);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }

    const requests = (data || []).map((r: Record<string, unknown>) => ({
      id: r.id,
      customerName: r.customer_name,
      // Phone hidden — revealed when claimed
      customerArea: r.customer_area,
      trade: r.trade,
      jobDescription: r.job_description,
      budgetRange: r.budget_range,
      urgency: r.urgency,
      createdAt: r.created_at,
    }));

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Quote requests GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
