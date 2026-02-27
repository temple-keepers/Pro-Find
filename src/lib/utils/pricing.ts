/**
 * Format a price in Guyanese Dollars.
 * Input: 15000
 * Output: "$15,000"
 */
export function formatGYD(amount: number): string {
  return `$${amount.toLocaleString("en-GY")}`;
}

/**
 * Format a price range.
 * Input: 8000, 15000
 * Output: "$8,000 - $15,000"
 */
export function formatPriceRange(low: number, high: number): string {
  return `${formatGYD(low)} - ${formatGYD(high)}`;
}

/**
 * Format price for compact display.
 * Input: 15000
 * Output: "$15K"
 */
export function formatGYDCompact(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}K`;
  }
  return formatGYD(amount);
}
