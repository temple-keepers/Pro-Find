// ============================================
// ProFind Guyana — Unified User Types & Roles
// ============================================

export type UserRole = "customer" | "provider" | "shop_owner" | "admin";

export interface AppUser {
  id: string;          // users table ID
  authId: string;      // Supabase Auth ID
  email: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  area?: string;
  avatarUrl?: string;
  roles: UserRole[];
  providerId?: string; // if role includes 'provider'
  shopId?: string;     // if role includes 'shop_owner'
}

export function hasRole(user: AppUser | null, role: UserRole): boolean {
  return user?.roles?.includes(role) || false;
}

export function isAdmin(user: AppUser | null): boolean {
  return hasRole(user, "admin");
}

export function isProvider(user: AppUser | null): boolean {
  return hasRole(user, "provider");
}

export function isShopOwner(user: AppUser | null): boolean {
  return hasRole(user, "shop_owner");
}

// Admin emails — reads from ADMIN_EMAILS env var (comma-separated),
// falls back to hardcoded list if env var not set.
// Set ADMIN_EMAILS=denise@sagacitynetwork.net in .env.local
function getAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS;
  if (envEmails) {
    return envEmails
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
  }
  return ["denise@sagacitynetwork.net"];
}

export const ADMIN_EMAILS = getAdminEmails();

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase().trim());
}
