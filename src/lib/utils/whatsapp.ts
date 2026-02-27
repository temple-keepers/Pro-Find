/**
 * Generate a WhatsApp deep link for contacting a provider.
 * Pre-fills a message mentioning ProFind so the provider knows
 * where the lead came from.
 */
export function getWhatsAppLink(
  phone: string,
  providerName: string,
  trade?: string
): string {
  const cleaned = phone.replace(/\D/g, "");
  const withCountry = cleaned.startsWith("592") ? cleaned : `592${cleaned}`;

  const tradeText = trade ? ` I need help with ${trade}.` : "";
  const message = encodeURIComponent(
    `Hi ${providerName}, I found you on ProFind Guyana.${tradeText} Are you available?`
  );

  return `https://wa.me/${withCountry}?text=${message}`;
}

/**
 * Format a WhatsApp URL with a custom message.
 * Generic utility for any WhatsApp deep link.
 */
export function formatWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const withCountry = cleaned.startsWith("592") ? cleaned : `592${cleaned}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a WhatsApp share link for sharing a provider profile.
 */
export function getWhatsAppShareLink(
  providerName: string,
  trade: string,
  profileUrl: string
): string {
  const message = encodeURIComponent(
    `Check out ${providerName} (${trade}) on ProFind Guyana → ${profileUrl}`
  );
  return `https://wa.me/?text=${message}`;
}

/**
 * Generate a WhatsApp link for requesting a review.
 * Used by providers to ask customers for feedback.
 */
export function getReviewRequestLink(
  customerPhone: string,
  providerName: string,
  reviewUrl: string
): string {
  const cleaned = customerPhone.replace(/\D/g, "");
  const withCountry = cleaned.startsWith("592") ? cleaned : `592${cleaned}`;

  const message = encodeURIComponent(
    `Hi! Thanks for using my services. If you have a minute, I'd appreciate a review on ProFind Guyana — it helps me get more work. Just tap here: ${reviewUrl}`
  );

  return `https://wa.me/${withCountry}?text=${message}`;
}
