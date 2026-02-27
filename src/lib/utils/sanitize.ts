// ============================================
// ProFind Guyana — Input Sanitization
// Prevents PostgREST filter injection and other
// input-based attacks.
// ============================================

/**
 * Sanitize a string for use in PostgREST ilike/or filters.
 * Removes characters that could inject filter operators:
 *   . (field separator)
 *   , (filter separator)
 *   ( ) (grouping)
 *   % (already added by the query builder)
 */
export function sanitizeSearchInput(input: string): string {
  return input
    .replace(/[.,()%\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200); // Cap length
}

/**
 * Validate that a role string is one of the allowed values.
 */
export function isValidRole(role: string): role is "customer" | "provider" | "shop_owner" {
  return ["customer", "provider", "shop_owner"].includes(role);
}

/**
 * Sanitize a phone number for Guyanese format.
 * Returns cleaned digits only. Does not add country code.
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "").slice(0, 15);
}
