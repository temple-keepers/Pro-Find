// ============================================
// ProFind Guyana — Trust Layer Configuration
// ============================================

import type { Provider } from "@/lib/types";

// --- Trust Tiers ---

export type TrustTier = "new" | "verified" | "trusted" | "elite";

export interface TrustTierConfig {
  id: TrustTier;
  label: string;
  color: string;
  bgColor: string;
  ringColor: string;
  minPoints: number;
}

export const TRUST_TIERS: TrustTierConfig[] = [
  { id: "new",      label: "New",      color: "text-gray-500",        bgColor: "bg-gray-100",        ringColor: "ring-gray-200",        minPoints: 0 },
  { id: "verified", label: "Verified", color: "text-brand-green-600", bgColor: "bg-brand-green-50",  ringColor: "ring-brand-green-200", minPoints: 20 },
  { id: "trusted",  label: "Trusted",  color: "text-blue-600",        bgColor: "bg-blue-50",         ringColor: "ring-blue-200",        minPoints: 50 },
  { id: "elite",    label: "Elite",    color: "text-brand-gold-800",  bgColor: "bg-brand-gold-50",   ringColor: "ring-brand-gold-300",  minPoints: 80 },
];

export function computeTrustScore(provider: Pick<
  Provider,
  "isVerified" | "idVerified" | "reviewCount" | "avgRating" | "yearsExperience" | "bitCertified" | "isClaimed"
>): number {
  let score = 0;
  if (provider.isClaimed) score += 5;
  if (provider.isVerified) score += 15;
  if (provider.idVerified) score += 15;
  if (provider.bitCertified) score += 10;
  score += Math.min(provider.reviewCount, 25);          // up to 25pts
  score += Math.round(provider.avgRating * 3);           // up to 15pts
  score += Math.min(provider.yearsExperience || 0, 10);  // up to 10pts
  return score;
}

export function getTrustTier(score: number): TrustTierConfig {
  for (let i = TRUST_TIERS.length - 1; i >= 0; i--) {
    if (score >= TRUST_TIERS[i].minPoints) return TRUST_TIERS[i];
  }
  return TRUST_TIERS[0];
}

export function getProviderTrustTier(provider: Pick<
  Provider,
  "isVerified" | "idVerified" | "reviewCount" | "avgRating" | "yearsExperience" | "bitCertified" | "isClaimed"
>): TrustTierConfig {
  return getTrustTier(computeTrustScore(provider));
}

// --- Slot Limits ---

export const SLOT_LIMITS: Record<string, number> = {
  plumber: 5,
  electrician: 5,
  "ac-technician": 5,
  carpenter: 5,
  mason: 5,
  painter: 7,
  welder: 5,
  mechanic: 7,
};

export const DEFAULT_SLOT_LIMIT = 5;

export function getSlotLimit(tradeId: string): number {
  return SLOT_LIMITS[tradeId] ?? DEFAULT_SLOT_LIMIT;
}

// --- Tenure Helpers ---

export function getTenureMonths(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
}

export function formatTenure(createdAt: string): string {
  const months = getTenureMonths(createdAt);
  if (months < 1) return "New member";
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years}yr ${rem}mo`;
}
