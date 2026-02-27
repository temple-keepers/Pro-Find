/**
 * Format a phone number for display in Guyanese format.
 * Input: "6001234" or "5926001234" or "+5926001234"
 * Output: "600-1234"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  // Remove country code if present
  const local = cleaned.startsWith("592")
    ? cleaned.slice(3)
    : cleaned.startsWith("+592")
    ? cleaned.slice(4)
    : cleaned;

  // Format as XXX-XXXX
  if (local.length === 7) {
    return `${local.slice(0, 3)}-${local.slice(3)}`;
  }

  return local;
}

/**
 * Format phone for international dialing.
 * Returns: +592XXXXXXX
 */
export function formatPhoneInternational(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const local = cleaned.startsWith("592") ? cleaned.slice(3) : cleaned;
  return `+592${local}`;
}

/**
 * Validate a Guyanese phone number.
 * Accepts 7-digit local or with 592 prefix.
 */
export function isValidGuyanesePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  const local = cleaned.startsWith("592") ? cleaned.slice(3) : cleaned;
  return local.length === 7 && /^[2-9]/.test(local);
}
