// ============================================
// ProFind Guyana — API Route Auth Helper
// Extracts and verifies the Supabase session
// from incoming API requests.
// ============================================

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AuthenticatedUser {
  authId: string;
  email: string;
}

export interface AuthenticatedProvider {
  authId: string;
  email: string;
  providerId: string;
  plan: string;
}

export interface AuthenticatedShop {
  authId: string;
  email: string;
  shopId: string;
  plan: string;
}

/**
 * Verify that the request comes from an authenticated Supabase user.
 * Returns the auth user or a 401 JSON response.
 */
export async function requireAuth(): Promise<
  { user: AuthenticatedUser; error?: never } | { user?: never; error: NextResponse }
> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  return {
    user: {
      authId: user.id,
      email: user.email,
    },
  };
}

/**
 * Verify auth AND that the user owns the specified provider.
 * Returns the provider record or a 401/403 response.
 */
export async function requireProviderOwner(
  providerId: string
): Promise<
  | { provider: AuthenticatedProvider; error?: never }
  | { provider?: never; error: NextResponse }
> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  // Check the provider belongs to this user
  const { data: provider, error: dbError } = await supabase
    .from("providers")
    .select("id, auth_id, plan")
    .eq("id", providerId)
    .single();

  if (dbError || !provider) {
    return {
      error: NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      ),
    };
  }

  if (provider.auth_id !== user.id) {
    // Also check if user is admin
    const isAdmin = getAdminEmails().includes(
      (user.email || "").toLowerCase().trim()
    );
    if (!isAdmin) {
      return {
        error: NextResponse.json(
          { error: "You do not own this provider profile" },
          { status: 403 }
        ),
      };
    }
  }

  return {
    provider: {
      authId: user.id,
      email: user.email || "",
      providerId: provider.id,
      plan: provider.plan || "free",
    },
  };
}

/**
 * Verify auth AND that the user owns the specified shop.
 */
export async function requireShopOwner(
  shopId: string
): Promise<
  | { shop: AuthenticatedShop; error?: never }
  | { shop?: never; error: NextResponse }
> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  const { data: shop, error: dbError } = await supabase
    .from("shops")
    .select("id, user_id, plan")
    .eq("id", shopId)
    .single();

  if (dbError || !shop) {
    return {
      error: NextResponse.json(
        { error: "Shop not found" },
        { status: 404 }
      ),
    };
  }

  // Verify ownership via users table
  const { data: appUser } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!appUser || shop.user_id !== appUser.id) {
    const isAdmin = getAdminEmails().includes(
      (user.email || "").toLowerCase().trim()
    );
    if (!isAdmin) {
      return {
        error: NextResponse.json(
          { error: "You do not own this shop" },
          { status: 403 }
        ),
      };
    }
  }

  return {
    shop: {
      authId: user.id,
      email: user.email || "",
      shopId: shop.id,
      plan: shop.plan || "free",
    },
  };
}

/**
 * Verify the user is an admin.
 */
export async function requireAdmin(): Promise<
  { user: AuthenticatedUser; error?: never } | { user?: never; error: NextResponse }
> {
  const result = await requireAuth();
  if (result.error) return result;

  const isAdmin = getAdminEmails().includes(
    result.user.email.toLowerCase().trim()
  );
  if (!isAdmin) {
    return {
      error: NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      ),
    };
  }

  return result;
}

/**
 * Get admin emails from env var with fallback.
 */
export function getAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS;
  if (envEmails) {
    return envEmails
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
  }
  // Fallback to hardcoded (will be removed once env var is set)
  return ["denise@sagacitynetwork.net"];
}
